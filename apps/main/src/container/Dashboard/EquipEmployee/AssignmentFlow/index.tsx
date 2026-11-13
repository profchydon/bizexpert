"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import routes from "@/routes";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import useCart from "@/hooks/useCart";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import type { OfficeDeliveryContact } from "@/api/baseQueries/companiesApi/officesApi/getDeliveryContacts";
import useAssignmentEmployees from "./useAssignmentEmployees";
import AssignmentHeader from "./AssignmentHeader";
import AssignmentFooter from "./AssignmentFooter";
import BatchActionBar from "./BatchActionBar";
import CrossCountryModal from "./CrossCountryModal";
import AddEmployees from "../Employee/AddEmployees";
import useAssignmentState from "./useAssignmentState";
import useAssignmentFlowData from "./useAssignmentFlowData";
import { getCartCountry } from "./cartCountry";
import assignNewEmployee, { AddEmployeeTarget } from "./onEmployeeAdded";
import withFallbackCountry from "./withFallbackCountry";
import AssignmentBody from "./AssignmentBody";
import AssignmentEmptyState from "./AssignmentEmptyState";
import { isConfigurableDevice, setupOptionsForAll } from "./deviceSetup";
import { useConfigurableTypeIds } from "./useConfigurableTypeIds";
import OfficeContactFetcher from "./OfficeContactFetcher";
import {
  defaultContactFromList,
  useAssignmentOffices,
} from "./useAssignmentOffices";
import { officesInCountry } from "./destinationItems";
import {
  clearOfficePreseed,
  readOfficeContactPreseed,
  readOfficePreseed,
} from "./officePreseed";
import { contactSourceFor } from "./officeContactRules";
import {
  firstUnassignedUnitId,
  summariseAssignments,
  unitRowId,
} from "./destinationSummary";

const AssignmentFlow = () => {
  const { push, isPending: isNavigatePending } = useTransitionRouter();
  const dispatch = useAppDispatch();
  const companyId = useWorkspaceCompanyId();
  const configurableTypes = useConfigurableTypeIds();
  const selectedCountry = useAppSelector(
    (state) => state.persistedReducers.equipEmployee.country,
  );
  const { carts, isCartsLoading, removeItemFromCart, updateQty } = useCart();
  const cartsWithCountry = useMemo(
    () => withFallbackCountry(carts, selectedCountry),
    [carts, selectedCountry],
  );
  const {
    allEmployees: employees,
    getEmployeesForCountry,
    isLoading: isEmployeesLoading,
    isReady: isEmployeesReady,
    refetch: refetchEmployees,
  } = useAssignmentEmployees(companyId, cartsWithCountry, selectedCountry);

  const { state, dispatch: assignmentDispatch } =
    useAssignmentState(cartsWithCountry);
  const { offices } = useAssignmentOffices(state.assignments);
  const { data: countriesResponse } = useGetCountriesQuery();
  const countries =
    (countriesResponse?.data?.data as
      | Array<{ id?: string; name?: string; code?: string }>
      | undefined) ?? [];
  const [officeContacts, setOfficeContacts] = useState<
    Record<string, OfficeDeliveryContact[]>
  >({});
  const handleOfficeContacts = useCallback(
    (officeId: string, contacts: OfficeDeliveryContact[]) => {
      setOfficeContacts((current) => ({ ...current, [officeId]: contacts }));
    },
    [],
  );
  const defaultContacts = useMemo(() => {
    const next: Record<
      string,
      { contactEmployeeId: string; contactEmployeeName: string }
    > = {};
    Object.entries(officeContacts).forEach(([officeId, contacts]) => {
      const contact = defaultContactFromList(contacts);
      if (contact) next[officeId] = contact;
    });
    return next;
  }, [officeContacts]);
  const officeCountryIds = useMemo(() => {
    const next: Record<string, string> = {};
    offices.forEach((office) => {
      const match = countries.find((country) => {
        const name = (country.name || "").trim().toLowerCase();
        const code = (country.code || "").trim().toLowerCase();
        const region = (office.region || "").trim().toLowerCase();
        return region === name || region === code;
      });
      if (match?.id) next[office.id] = match.id;
    });
    return next;
  }, [countries, offices]);
  const isDecisionDataReady =
    !isCartsLoading && !isEmployeesLoading && isEmployeesReady;
  const [crossCountryOpen, setCrossCountryOpen] = useState(false);
  const [isAddEmployeeDrawerOpen, setIsAddEmployeeDrawerOpen] = useState(false);
  const [addEmployeeTarget, setAddEmployeeTarget] =
    useState<AddEmployeeTarget | null>(null);
  const {
    groupedByCountry,
    assignmentsMap,
    selectedCount,
    batchEmployeeCountry,
    batchEmployeeCountryCode,
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
  } = useAssignmentFlowData({
    state,
    employees,
    offices,
    officeCountryIds,
    dispatch,
    assignmentDispatch,
    removeItemFromCart,
    navigateToOrderSummary: () => push(routes.EQUIP_EMPLOYEE_ORDER_SUMMARY),
  });

  const handleRemoveUnit = async (unitId: string) => {
    const unit = state.assignments.find((item) => item.unitId === unitId);
    if (!unit) return;
    const pricingId = unit.cartItem.pricing.id;
    const remaining = state.assignments.filter(
      (item) =>
        item.unitId !== unitId && item.cartItem.pricing.id === pricingId,
    ).length;
    assignmentDispatch({ type: "REMOVE_UNIT", unitId });
    if (remaining === 0) await removeItemFromCart(pricingId);
    else await updateQty(pricingId, remaining);
  };

  const isEmpty =
    isDecisionDataReady &&
    state.assignments.length === 0 &&
    cartsWithCountry.length === 0;

  const handleConfirm = async () => {
    if (crossBorderPairs.length > 0) {
      setCrossCountryOpen(true);
      return;
    }
    await runConfirm();
  };

  useEffect(() => {
    const officeId = readOfficePreseed();
    if (!officeId) return;
    const office = offices.find((item) => item.id === officeId);
    const preferredContactId = readOfficeContactPreseed();
    const preferred = preferredContactId
      ? officeContacts[officeId]?.find((item) => item.id === preferredContactId)
      : undefined;
    const contact = preferred
      ? {
          contactEmployeeId: preferred.id,
          contactEmployeeName: [preferred.first_name, preferred.last_name]
            .filter(Boolean)
            .join(" ")
            .trim(),
        }
      : defaultContacts[officeId];
    if (!office || !contact) return;
    let applied = false;
    state.assignments.forEach((unit) => {
      if (unit.destination.type !== "unassigned") return;
      const country = getCartCountry(unit.cartItem);
      if (
        officesInCountry([office], country.label, country.code).length === 0
      ) {
        return;
      }
      applied = true;
      assignmentDispatch({
        type: "ASSIGN_DESTINATION",
        unitId: unit.unitId,
        destination: {
          type: "office",
          officeId: office.id,
          officeName: office.name,
          contactEmployeeId: contact.contactEmployeeId,
          contactEmployeeName: contact.contactEmployeeName,
        },
      });
    });
    if (applied) {
      clearOfficePreseed();
    }
  }, [
    assignmentDispatch,
    defaultContacts,
    officeContacts,
    offices,
    state.assignments,
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-secondary -page-mx">
      {companyId &&
        offices.map((office) => (
          <OfficeContactFetcher
            key={office.id}
            companyId={companyId}
            officeId={office.id}
            onContacts={handleOfficeContacts}
          />
        ))}
      <div className="sticky top-[72px] z-30 border-b border-secondary bg-white page-px">
        <div className="py-4">
          <AssignmentHeader
            onBack={() => push(routes.EQUIP_EMPLOYEE_MARKETPLACE)}
          />
        </div>
        {selectedCount >= 2 && (
          <div className="pb-4">
            <BatchActionBar
              key={Array.from(state.selectedIds)
                .sort((a, b) => a.localeCompare(b))
                .join("|")}
              selectedCount={selectedCount}
              employees={
                batchEmployeeCountryCode
                  ? getEmployeesForCountry(batchEmployeeCountryCode)
                  : employees
              }
              employeeCountryLabel={batchEmployeeCountry}
              employeeCountryCode={batchEmployeeCountryCode}
              offices={offices}
              contacts={defaultContacts}
              batchAssignedEmployeeIds={batchAssignedEmployeeIds}
              batchFulfilmentDate={batchFulfilmentDate}
              batchDeviceSetup={batchDeviceSetup}
              batchSetupOptions={setupOptionsForAll(
                state.assignments
                  .filter((unit) => state.selectedIds.has(unit.unitId))
                  .map((unit) => unit.cartItem.asset ?? {}),
                configurableTypes,
              )}
              batchMinFulfilmentDate={batchMinFulfilmentDate}
              batchOffice={batchOffice}
              batchContactId={batchContactId}
              allSelectedAreStorage={state.assignments
                .filter((unit) => state.selectedIds.has(unit.unitId))
                .every((unit) => unit.destination.type === "storage")}
              officeDefault={batchOfficeDefault}
              officeContacts={
                batchOffice ? (officeContacts[batchOffice.id] ?? []) : []
              }
              onSetOfficeContact={(contact) =>
                assignmentDispatch({
                  type: "BATCH_SET_OFFICE_CONTACT",
                  contactEmployeeId: contact.contactEmployeeId,
                  contactEmployeeName: contact.contactEmployeeName,
                  source: contactSourceFor(
                    contact.contactEmployeeId,
                    batchOfficeDefault,
                  ),
                })
              }
              onAssignDestination={(destination) =>
                assignmentDispatch({
                  type: "BATCH_ASSIGN_DESTINATION",
                  destination,
                })
              }
              onAddEmployeeAction={() => {
                if (!batchEmployeeCountry) {
                  return;
                }
                setAddEmployeeTarget({
                  kind: "batch",
                  countryLabel: batchEmployeeCountry,
                });
                setIsAddEmployeeDrawerOpen(true);
              }}
              onSetBatchFulfilmentDate={(fulfilmentDate) => {
                batchAssignedEmployeeIds.forEach((employeeId) => {
                  assignmentDispatch({
                    type: "SET_EMPLOYEE_FULFILMENT_DATE",
                    employeeId,
                    fulfilmentDate,
                  });
                });
                assignmentDispatch({
                  type: "BATCH_SET_FULFILLMENT_DATE",
                  date: fulfilmentDate,
                });
              }}
              onSetBatchDeviceSetup={(deviceSetup) => {
                state.assignments
                  .filter(
                    (unit) =>
                      state.selectedIds.has(unit.unitId) &&
                      isConfigurableDevice(
                        unit.cartItem.asset ?? {},
                        configurableTypes,
                      ),
                  )
                  .forEach((unit) => {
                    assignmentDispatch({
                      type: "SET_UNIT_DEVICE_SETUP",
                      unitId: unit.unitId,
                      deviceSetup,
                    });
                  });
              }}
              onClearSelection={() =>
                assignmentDispatch({ type: "CLEAR_SELECTION" })
              }
            />
          </div>
        )}
      </div>

      <div className="flex-1 py-6 page-px">
        {isEmpty && (
          <AssignmentEmptyState
            onBrowse={() => push(routes.EQUIP_EMPLOYEE_MARKETPLACE)}
          />
        )}
        <AssignmentBody
          isDecisionDataReady={isDecisionDataReady}
          upcomingHoliday={upcomingHoliday}
          groupedByCountry={groupedByCountry}
          assignmentsMap={assignmentsMap}
          getEmployeesForCountry={getEmployeesForCountry}
          offices={offices}
          contacts={defaultContacts}
          officeContacts={officeContacts}
          selectedIds={state.selectedIds}
          fulfilmentDatesByEmployee={state.fulfilmentDatesByEmployee}
          deviceSetupsByUnit={state.deviceSetupsByUnit}
          duplicateMap={duplicateMap}
          crossCountryByUnitId={crossCountryByUnitId}
          onToggleCountrySelection={handleCountrySelection}
          onRemoveCountry={handleRemoveCountry}
          onToggleSelect={(unitId) =>
            assignmentDispatch({ type: "TOGGLE_SELECT", unitId })
          }
          onAssignDestination={(unitId, destination) =>
            assignmentDispatch({
              type: "ASSIGN_DESTINATION",
              unitId,
              destination,
            })
          }
          onAssignAllInCountry={(countryCode, destination) =>
            assignmentDispatch({
              type: "ASSIGN_ALL_IN_COUNTRY",
              countryCode,
              destination,
            })
          }
          onSetOfficeDefaultContact={(officeId, contact) =>
            assignmentDispatch({
              type: "SET_OFFICE_DEFAULT_CONTACT",
              officeId,
              contactEmployeeId: contact.contactEmployeeId,
              contactEmployeeName: contact.contactEmployeeName,
            })
          }
          onSetOfficeContact={(
            unitId,
            contactEmployeeId,
            contactEmployeeName,
            source,
          ) =>
            assignmentDispatch({
              type: "SET_OFFICE_CONTACT",
              unitId,
              contactEmployeeId,
              contactEmployeeName,
              source,
            })
          }
          onAssignEmployee={(unitId, employeeId, employeeName) =>
            assignmentDispatch({
              type: "ASSIGN_EMPLOYEE",
              unitId,
              employeeId,
              employeeName,
            })
          }
          onAssignStorage={(unitId) =>
            assignmentDispatch({ type: "ASSIGN_STORAGE", unitId })
          }
          onAddEmployeeAction={(unitId) => {
            const assignment = assignmentsMap.get(unitId);
            if (!assignment) {
              return;
            }

            setAddEmployeeTarget({
              kind: "row",
              unitId,
              countryLabel: getCartCountry(assignment.cartItem).label,
            });
            setIsAddEmployeeDrawerOpen(true);
          }}
          onSetFulfilmentDate={(employeeId, fulfilmentDate) => {
            const isUnitDate = state.assignments.some(
              (unit) => unit.unitId === employeeId,
            );
            assignmentDispatch(
              isUnitDate
                ? {
                    type: "SET_UNIT_FULFILLMENT_DATE",
                    unitId: employeeId,
                    date: fulfilmentDate,
                  }
                : {
                    type: "SET_EMPLOYEE_FULFILMENT_DATE",
                    employeeId,
                    fulfilmentDate,
                  },
            );
          }}
          onSetDeviceSetup={(unitId, deviceSetup) =>
            assignmentDispatch({
              type: "SET_UNIT_DEVICE_SETUP",
              unitId,
              deviceSetup,
            })
          }
          onRemoveUnit={handleRemoveUnit}
        />
      </div>

      <CrossCountryModal
        open={crossCountryOpen}
        pairs={crossBorderPairs}
        onClose={() => setCrossCountryOpen(false)}
        onProceed={async () => {
          setCrossCountryOpen(false);
          await runConfirm();
        }}
        isProceedLoading={isNavigatePending}
      />
      <AssignmentFooter
        summary={summariseAssignments(state)}
        onBack={() => push(routes.EQUIP_EMPLOYEE_MARKETPLACE)}
        onConfirm={handleConfirm}
        onJumpToUnassigned={() => {
          const unitId = firstUnassignedUnitId(state.assignments);
          if (!unitId) return;
          document
            .getElementById(unitRowId(unitId))
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
        }}
        isBackLoading={isNavigatePending}
        isConfirmLoading={isNavigatePending}
      />

      {addEmployeeTarget && (
        <AddEmployees
          isOpen={isAddEmployeeDrawerOpen}
          onClose={() => {
            setIsAddEmployeeDrawerOpen(false);
            setTimeout(() => {
              setAddEmployeeTarget(null);
              refetchEmployees();
            }, 220);
          }}
          initialTab="add"
          initialCountry={addEmployeeTarget.countryLabel}
          suppressRouteSync
          lockCountryToInitial
          hideTabs
          disabledTabs={["import", "hris", "invite"]}
          onEmployeeAdded={(employee) =>
            assignNewEmployee(employee, addEmployeeTarget, assignmentDispatch)
          }
        />
      )}
    </div>
  );
};

export default AssignmentFlow;
