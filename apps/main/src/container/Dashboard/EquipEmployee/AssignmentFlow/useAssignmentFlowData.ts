import { Dispatch, useMemo } from "react";
import { setSelectedEmployees } from "@/store/slices/employeeSlice";
import { ReduxDispatch } from "@/store";
import { getCrossBorderPairs } from "./crossCountry";
import { groupUnitsByCountry } from "./groupUnitsByCountry";
import type { Office } from "@/container/Dashboard/Accounts/types";
import { AssignmentAction, AssignmentState, EmployeeOption } from "./types";
import { officeDefaultContact } from "./officeContactRules";
import { getUpcomingHoliday } from "../Marketplace/utils/deliveryHolidayUtils";
import { NIGERIA_HOLIDAYS_2026 } from "../Marketplace/data/nigeriaHolidays";
import { groupByEmployee } from "./utils";
import { getCartCountry } from "./cartCountry";
import { readCartCountryMap } from "@/hooks/cartCountryMemory";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import { formatDeliveryEstimate } from "../Marketplace/utils/formatDeliveryEstimate";
import { deliveryLeadDays } from "./earliestArrival";

interface UseAssignmentFlowDataArgs {
  state: AssignmentState;
  employees: EmployeeOption[];
  offices?: Office[];
  officeCountryIds?: Record<string, string>;
  dispatch: ReduxDispatch;
  assignmentDispatch: Dispatch<AssignmentAction>;
  removeItemFromCart: (pricingId: string) => Promise<void>;
  navigateToOrderSummary: () => void;
}

const useAssignmentFlowData = ({
  state,
  employees,
  offices = [],
  officeCountryIds = {},
  dispatch,
  assignmentDispatch,
  removeItemFromCart,
  navigateToOrderSummary,
}: UseAssignmentFlowDataArgs) => {
  const { data: countriesResponse } = useGetCountriesQuery();
  const countries =
    (countriesResponse?.data?.data as
      | Array<{
          id?: string;
          name?: string;
          code?: string;
          eta?: string | null;
        }>
      | undefined) ?? [];

  const groupedByCountry = useMemo(
    () => groupUnitsByCountry(state.assignments),
    [state.assignments],
  );
  const assignmentsMap = useMemo(
    () =>
      new Map(
        state.assignments.map((assignment) => [assignment.unitId, assignment]),
      ),
    [state.assignments],
  );
  const selectedCount = state.selectedIds.size;

  const batchEmployeeCountry = useMemo(() => {
    if (state.selectedIds.size < 2) {
      return null;
    }

    const countries = Array.from(
      new Set(
        state.assignments
          .filter((assignment) => state.selectedIds.has(assignment.unitId))
          .map((assignment) => getCartCountry(assignment.cartItem).label),
      ),
    );

    return countries.length === 1 ? countries[0] : null;
  }, [state.assignments, state.selectedIds]);

  const batchEmployeeCountryCode = useMemo(() => {
    if (state.selectedIds.size < 2) {
      return null;
    }

    const countryCodes = Array.from(
      new Set(
        state.assignments
          .filter((assignment) => state.selectedIds.has(assignment.unitId))
          .map((assignment) => getCartCountry(assignment.cartItem).code),
      ),
    );

    return countryCodes.length === 1 ? countryCodes[0] : null;
  }, [state.assignments, state.selectedIds]);

  const batchAssignedEmployeeId = useMemo(() => {
    if (state.selectedIds.size < 1) {
      return null;
    }

    const selectedAssignments = state.assignments.filter((assignment) =>
      state.selectedIds.has(assignment.unitId),
    );

    if (
      selectedAssignments.some(
        (assignment) => assignment.destination.type !== "employee",
      )
    ) {
      return null;
    }

    const employeeIds = Array.from(
      new Set(
        selectedAssignments.map((assignment) =>
          assignment.destination.type === "employee"
            ? assignment.destination.employeeId
            : "",
        ),
      ),
    ).filter(Boolean);

    return employeeIds.length === 1 ? employeeIds[0] : null;
  }, [state.assignments, state.selectedIds]);

  const batchAssignedEmployeeIds = useMemo(() => {
    const selectedAssignments = state.assignments.filter((assignment) =>
      state.selectedIds.has(assignment.unitId),
    );

    const allAssignedToEmployees = selectedAssignments.every(
      (assignment) => assignment.destination.type === "employee",
    );

    if (!allAssignedToEmployees) {
      return [];
    }

    return Array.from(
      new Set(
        selectedAssignments
          .map((assignment) =>
            assignment.destination.type === "employee"
              ? assignment.destination.employeeId
              : "",
          )
          .filter(Boolean),
      ),
    );
  }, [state.assignments, state.selectedIds]);

  const batchFulfilmentDate = useMemo(() => {
    if (batchAssignedEmployeeIds.length < 1) {
      return undefined;
    }

    const dates = batchAssignedEmployeeIds
      .map((employeeId) => state.fulfilmentDatesByEmployee[employeeId])
      .filter(Boolean);

    if (dates.length < 1) {
      return undefined;
    }

    const firstDate = dates[0];
    const allSame = dates.every((value) => value === firstDate);
    return allSame ? firstDate : undefined;
  }, [batchAssignedEmployeeIds, state.fulfilmentDatesByEmployee]);

  const batchDeviceSetup = useMemo(() => {
    if (state.selectedIds.size < 1) {
      return undefined;
    }

    const setups = [...state.selectedIds]
      .map((unitId) => state.deviceSetupsByUnit[unitId])
      .filter(Boolean);

    if (setups.length < 1) {
      return undefined;
    }

    const firstSetup = setups[0];
    const allSame = setups.every((value) => value === firstSetup);
    return allSame ? firstSetup : undefined;
  }, [state.deviceSetupsByUnit, state.selectedIds]);

  const batchOffice = useMemo(() => {
    const selected = state.assignments.filter((assignment) =>
      state.selectedIds.has(assignment.unitId),
    );
    if (selected.length < 2) return null;
    const first = selected[0]?.destination;
    if (first?.type !== "office") return null;
    const sameOffice = selected.every(
      (assignment) =>
        assignment.destination.type === "office" &&
        assignment.destination.officeId === first.officeId,
    );
    if (!sameOffice) return null;
    return offices.find((office) => office.id === first.officeId) ?? null;
  }, [offices, state.assignments, state.selectedIds]);

  const batchContactId = useMemo(() => {
    if (!batchOffice) return "";
    const selected = state.assignments.filter(
      (assignment) =>
        state.selectedIds.has(assignment.unitId) &&
        assignment.destination.type === "office",
    );
    const ids = Array.from(
      new Set(
        selected.map((assignment) =>
          assignment.destination.type === "office"
            ? assignment.destination.contactEmployeeId
            : "",
        ),
      ),
    ).filter(Boolean);
    return ids.length === 1 ? ids[0] : "";
  }, [batchOffice, state.assignments, state.selectedIds]);

  const batchOfficeDefault = useMemo(
    () =>
      batchOffice
        ? officeDefaultContact(state.assignments, batchOffice.id)
        : null,
    [batchOffice, state.assignments],
  );

  const batchMinFulfilmentDate = useMemo(() => {
    if (state.selectedIds.size < 1) {
      return undefined;
    }

    const rememberedByPricing = readCartCountryMap();

    const resolveAssignmentEta = (
      assignment: AssignmentState["assignments"][number],
    ) => {
      const cartCountry = getCartCountry(assignment.cartItem);
      const extendedCartItem =
        assignment.cartItem as typeof assignment.cartItem & {
          country?: { id?: string; name?: string; label?: string };
        };

      const matchedCountryEta = countries.find((item) => {
        if (
          extendedCartItem?.country?.id &&
          item?.id === extendedCartItem.country.id
        ) {
          return true;
        }

        if (
          cartCountry.code &&
          item?.code?.toUpperCase() === cartCountry.code.toUpperCase()
        ) {
          return true;
        }

        const normalizedItemName = (item?.name || "").trim().toLowerCase();
        const normalizedLabel = (cartCountry.label || "").trim().toLowerCase();
        const normalizedName = (extendedCartItem?.country?.name || "")
          .trim()
          .toLowerCase();

        return (
          normalizedItemName === normalizedLabel ||
          normalizedItemName === normalizedName
        );
      })?.eta;

      return (
        matchedCountryEta ||
        rememberedByPricing[assignment.cartItem.pricing.id]?.eta
      );
    };

    const selectedAssignments = state.assignments.filter(
      (assignment) =>
        state.selectedIds.has(assignment.unitId) &&
        assignment.destination.type !== "unassigned",
    );

    const requiredDays = selectedAssignments.reduce((maxDays, assignment) => {
      const resolvedEta = resolveAssignmentEta(assignment);
      const days = deliveryLeadDays(formatDeliveryEstimate(resolvedEta));
      return Math.max(maxDays, days);
    }, 0);

    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + requiredDays);
    return date;
  }, [countries, state.assignments, state.selectedIds]);

  const upcomingHoliday = useMemo(() => {
    const hasNigeria = state.assignments.some(
      (assignment) =>
        getCartCountry(assignment.cartItem).code.toLowerCase() === "ng",
    );

    if (!hasNigeria) {
      return null;
    }

    return getUpcomingHoliday(NIGERIA_HOLIDAYS_2026, new Date());
  }, [state.assignments]);

  const crossBorderPairs = useMemo(
    () => getCrossBorderPairs(state, employees),
    [state, employees],
  );
  const duplicateMap = useMemo(() => {
    const counts = new Map<string, number>();
    state.assignments.forEach((unit) => {
      if (unit.destination.type !== "employee") {
        return;
      }

      const key = `${unit.cartItem.pricing.id}-${unit.destination.employeeId}`;
      counts.set(key, (counts.get(key) || 0) + 1);
    });

    return counts;
  }, [state.assignments]);

  const crossCountryByUnitId = useMemo(
    () => new Map(crossBorderPairs.map((pair) => [pair.unitId, pair])),
    [crossBorderPairs],
  );

  const runConfirm = async () => {
    const selectedEmployees = groupByEmployee(
      state.assignments,
      employees,
      state.fulfilmentDatesByEmployee,
      state.deviceSetupsByUnit,
      offices.map((office) => ({
        id: office.id,
        name: office.name,
        address: office.address,
        region: office.region,
        countryId: officeCountryIds[office.id],
      })),
    );
    dispatch(setSelectedEmployees(selectedEmployees));
    navigateToOrderSummary();
  };

  const handleCountrySelection = (unitIds: string[]) => {
    const current = new Set(state.selectedIds);
    const allSelected =
      unitIds.length > 0 && unitIds.every((id) => current.has(id));
    if (allSelected) {
      unitIds.forEach((id) => current.delete(id));
    } else {
      unitIds.forEach((id) => current.add(id));
    }
    assignmentDispatch({ type: "SET_SELECTION", unitIds: [...current] });
  };

  const handleRemoveCountry = async (
    countryCode: string,
    unitIds: string[],
  ) => {
    assignmentDispatch({ type: "REMOVE_COUNTRY", countryCode });

    const pricingIds = Array.from(
      new Set(
        unitIds
          .map((id) => assignmentsMap.get(id)?.cartItem.pricing.id)
          .filter((value): value is string => Boolean(value)),
      ),
    );

    await Promise.all(pricingIds.map(async (id) => removeItemFromCart(id)));
  };

  return {
    groupedByCountry,
    assignmentsMap,
    selectedCount,
    batchEmployeeCountry,
    batchEmployeeCountryCode,
    batchAssignedEmployeeId,
    batchAssignedEmployeeIds,
    batchOffice,
    batchContactId,
    batchOfficeDefault,
    batchFulfilmentDate,
    batchDeviceSetup,
    batchMinFulfilmentDate,
    upcomingHoliday,
    crossBorderPairs,
    duplicateMap,
    crossCountryByUnitId,
    runConfirm,
    handleCountrySelection,
    handleRemoveCountry,
  };
};

export default useAssignmentFlowData;
