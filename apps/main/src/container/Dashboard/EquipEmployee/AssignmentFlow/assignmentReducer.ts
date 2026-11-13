import { AssignmentAction, AssignmentState, AssignmentUnit } from "./types";
import { ICart } from "@/types/cart";
import { getCartCountry } from "./cartCountry";
import {
  applyOfficeDefaultContact,
  applyRowContact,
  applySelectedContact,
  assignDestination,
  isAssigned,
  withInheritedContact,
} from "./officeContactRules";

const buildInitialState = (items: ICart[]): AssignmentState => {
  const assignments: AssignmentUnit[] = [];

  items.forEach((item) => {
    Array.from({ length: item.quantity }).forEach((_, index) => {
      assignments.push({
        unitId: `${item.pricing.id}-${index}`,
        cartItem: { ...item, quantity: 1 },
        destination: { type: "unassigned" },
      });
    });
  });

  return {
    assignments,
    selectedIds: new Set(),
    fulfilmentDatesByEmployee: {},
    deviceSetupsByUnit: {},
  };
};

const reconcileFromCart = (
  state: AssignmentState,
  items: ICart[],
): AssignmentState => {
  const next = buildInitialState(items);
  const previousByPricing = new Map<string, AssignmentUnit[]>();
  state.assignments.forEach((unit) => {
    const pricingId = unit.cartItem.pricing.id;
    previousByPricing.set(pricingId, [
      ...(previousByPricing.get(pricingId) ?? []),
      unit,
    ]);
  });

  const renamed = new Map<string, string>();
  const assignments = next.assignments.map((unit) => {
    const pricingId = unit.cartItem.pricing.id;
    const index = Number(unit.unitId.slice(pricingId.length + 1));
    const previous = previousByPricing.get(pricingId)?.[index];
    if (!previous) return unit;
    renamed.set(previous.unitId, unit.unitId);
    return {
      ...unit,
      destination: previous.destination,
      contactSource: previous.contactSource,
    };
  });

  const renameKeys = (record: Record<string, string>) =>
    Object.fromEntries(
      Object.entries(record).flatMap(([key, value]) => {
        if (renamed.has(key)) return [[renamed.get(key)!, value]];
        if (state.assignments.some((unit) => unit.unitId === key)) return [];
        return [[key, value]];
      }),
    );

  return {
    assignments,
    selectedIds: new Set(
      [...state.selectedIds].flatMap((id) =>
        renamed.has(id) ? [renamed.get(id)!] : [],
      ),
    ),
    fulfilmentDatesByEmployee: renameKeys(state.fulfilmentDatesByEmployee),
    deviceSetupsByUnit: renameKeys(state.deviceSetupsByUnit),
  };
};

const getCartItemsSignature = (items: ICart[]) =>
  items
    .map((item) => {
      const countryData = item as ICart & {
        country?: { code?: string; name?: string; label?: string };
      };
      const countryKey =
        countryData.country?.code ||
        countryData.country?.label ||
        countryData.country?.name ||
        item.asset?.country ||
        "";

      return `${item.pricing.id}:${item.quantity}:${countryKey}`;
    })
    .sort((a, b) => a.localeCompare(b))
    .join("|");

const countAssigned = (state: AssignmentState) => {
  const total = state.assignments.length;
  const assigned = state.assignments.filter((item) =>
    isAssigned(item.destination),
  ).length;

  return { assigned, total };
};

const reducer = (
  state: AssignmentState,
  action: AssignmentAction,
): AssignmentState => {
  const { assignments, selectedIds } = state;

  switch (action.type) {
    case "RESET_FROM_CART":
      return reconcileFromCart(state, action.items);

    case "REMOVE_UNIT": {
      const { [action.unitId]: _removedSetup, ...deviceSetupsByUnit } =
        state.deviceSetupsByUnit;
      const { [action.unitId]: _removedDate, ...fulfilmentDatesByEmployee } =
        state.fulfilmentDatesByEmployee;
      const nextSelected = new Set(selectedIds);
      nextSelected.delete(action.unitId);
      return {
        assignments: assignments.filter(
          (item) => item.unitId !== action.unitId,
        ),
        selectedIds: nextSelected,
        fulfilmentDatesByEmployee,
        deviceSetupsByUnit,
      };
    }

    case "SET_EMPLOYEE_FULFILMENT_DATE":
      return {
        ...state,
        fulfilmentDatesByEmployee: {
          ...state.fulfilmentDatesByEmployee,
          [action.employeeId]: action.fulfilmentDate,
        },
      };

    case "SET_UNIT_DEVICE_SETUP":
      return {
        ...state,
        deviceSetupsByUnit: {
          ...state.deviceSetupsByUnit,
          [action.unitId]: action.deviceSetup,
        },
      };

    case "ASSIGN_EMPLOYEE":
      return {
        ...state,
        assignments: assignments.map((item) =>
          item.unitId === action.unitId
            ? {
                ...item,
                destination: {
                  type: "employee",
                  employeeId: action.employeeId,
                  employeeName: action.employeeName,
                },
              }
            : item,
        ),
      };

    case "ASSIGN_STORAGE":
      return {
        ...state,
        assignments: assignments.map((item) => {
          if (item.unitId !== action.unitId) {
            return item;
          }

          return {
            ...item,
            destination:
              item.destination.type === "storage"
                ? { type: "unassigned" }
                : { type: "storage" },
          };
        }),
      };

    case "TOGGLE_SELECT": {
      const next = new Set(selectedIds);
      if (next.has(action.unitId)) next.delete(action.unitId);
      else next.add(action.unitId);
      return { ...state, selectedIds: next };
    }

    case "SET_SELECTION":
      return { ...state, selectedIds: new Set(action.unitIds) };

    case "CLEAR_SELECTION":
      return { ...state, selectedIds: new Set() };

    case "BATCH_ASSIGN_EMPLOYEE":
      return {
        ...state,
        assignments: assignments.map((item) =>
          selectedIds.has(item.unitId)
            ? {
                ...item,
                destination: {
                  type: "employee",
                  employeeId: action.employeeId,
                  employeeName: action.employeeName,
                },
              }
            : item,
        ),
      };

    case "BATCH_ASSIGN_STORAGE":
      return {
        ...state,
        assignments: assignments.map((item) =>
          selectedIds.has(item.unitId)
            ? { ...item, destination: { type: "storage" } }
            : item,
        ),
      };

    case "BATCH_ASSIGN_DESTINATION": {
      const destination = withInheritedContact(assignments, action.destination);
      return {
        ...state,
        assignments: assignments.map((item) =>
          selectedIds.has(item.unitId)
            ? assignDestination(item, destination)
            : item,
        ),
      };
    }

    case "ASSIGN_DESTINATION": {
      const destination = withInheritedContact(assignments, action.destination);
      return {
        ...state,
        assignments: assignments.map((item) =>
          item.unitId === action.unitId
            ? assignDestination(item, destination)
            : item,
        ),
      };
    }

    case "SET_OFFICE_CONTACT":
      return {
        ...state,
        assignments: applyRowContact(
          assignments,
          action.unitId,
          action,
          action.source,
        ),
      };

    case "SET_OFFICE_DEFAULT_CONTACT":
      return {
        ...state,
        assignments: applyOfficeDefaultContact(
          assignments,
          action.officeId,
          action,
        ),
      };

    case "BATCH_SET_OFFICE_CONTACT":
      return {
        ...state,
        assignments: applySelectedContact(
          assignments,
          selectedIds,
          action,
          action.source,
        ),
      };

    case "ASSIGN_ALL_IN_COUNTRY": {
      const destination = withInheritedContact(assignments, action.destination);
      return {
        ...state,
        assignments: assignments.map((item) =>
          getCartCountry(item.cartItem).code.toLowerCase() ===
          action.countryCode.toLowerCase()
            ? assignDestination(item, destination)
            : item,
        ),
      };
    }

    case "SET_UNIT_FULFILLMENT_DATE":
      return {
        ...state,
        fulfilmentDatesByEmployee: {
          ...state.fulfilmentDatesByEmployee,
          [action.unitId]: action.date ?? "",
        },
      };

    case "BATCH_SET_FULFILLMENT_DATE":
      return {
        ...state,
        fulfilmentDatesByEmployee: {
          ...state.fulfilmentDatesByEmployee,
          ...Object.fromEntries(
            [...selectedIds].map((unitId) => [unitId, action.date ?? ""]),
          ),
        },
      };

    case "REMOVE_COUNTRY": {
      const remaining = assignments.filter(
        (item) =>
          getCartCountry(item.cartItem).code.toLowerCase() !==
          action.countryCode.toLowerCase(),
      );
      const nextSelected = new Set(
        [...selectedIds].filter((id) =>
          remaining.some((item) => item.unitId === id),
        ),
      );
      return {
        ...state,
        assignments: remaining,
        selectedIds: nextSelected,
      };
    }

    default:
      return state;
  }
};

export {
  buildInitialState,
  reconcileFromCart,
  countAssigned,
  getCartItemsSignature,
  isAssigned,
  reducer,
};
