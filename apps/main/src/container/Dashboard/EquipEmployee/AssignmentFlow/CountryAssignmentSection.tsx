import type { Office } from "@/container/Dashboard/Accounts/types";
import formatAmount from "@/utils/formatAmount";
import { useWorkspaceCurrencySymbol } from "@/hooks/useWorkspaceCurrencySymbol";
import AssignmentGroupHeader from "./AssignmentGroupHeader";
import AssignmentGroupInvite from "./AssignmentGroupInvite";
import type { OfficeDeliveryContact } from "@/api/baseQueries/companiesApi/officesApi/getDeliveryContacts";
import { isBuyableOffice } from "@/container/Dashboard/Accounts/Offices/hooks/isBuyableOffice";
import { CrossBorderPair } from "./crossCountry";
import DeviceRow from "./DeviceRow";
import CountryBulkDestination from "./CountryBulkDestination";
import NoEmployeeCountryWarning from "./NoEmployeeCountryWarning";
import AssignmentColumnHeader from "./AssignmentColumnHeader";
import { officesInCountry } from "./destinationItems";
import { summariseUnits } from "./destinationSummary";
import {
  AssignmentDestination,
  AssignmentUnit,
  ContactSource,
  EmployeeOption,
} from "./types";
import { CountryUnitGroup } from "./groupUnitsByCountry";
import type { OfficeContact } from "./officeContactRules";

interface CountryAssignmentSectionProps {
  group: CountryUnitGroup;
  assignmentsMap: Map<string, AssignmentUnit>;
  employees: EmployeeOption[];
  offices: Office[];
  contacts: Record<
    string,
    { contactEmployeeId: string; contactEmployeeName: string }
  >;
  officeContacts: Record<string, OfficeDeliveryContact[]>;
  canShowNoEmployeeWarning?: boolean;
  selectedIds: Set<string>;
  fulfilmentDatesByEmployee: Record<string, string>;
  deviceSetupsByUnit: Record<string, string>;
  duplicateMap: Map<string, number>;
  crossCountryByUnitId: Map<string, CrossBorderPair>;
  onToggleCountrySelection: (unitIds: string[]) => void;
  onRemoveCountry: () => void;
  onToggleSelect: (unitId: string) => void;
  onAssignDestination: (
    unitId: string,
    destination: AssignmentDestination,
  ) => void;
  onAssignAllInCountry: (destination: AssignmentDestination) => void;
  onSetOfficeDefaultContact: (officeId: string, contact: OfficeContact) => void;
  onSetOfficeContact: (
    unitId: string,
    contactEmployeeId: string,
    contactEmployeeName: string,
    source: ContactSource,
  ) => void;
  onAssignEmployee: (
    unitId: string,
    employeeId: string,
    employeeName: string,
  ) => void;
  onAssignStorage: (unitId: string) => void;
  onAddEmployeeAction: (unitId: string) => void;
  onSetFulfilmentDate: (employeeId: string, fulfilmentDate: string) => void;
  onSetDeviceSetup: (unitId: string, deviceSetup: string) => void;
  onRemoveUnit: (unitId: string) => void;
}

const CountryAssignmentSection: React.FC<CountryAssignmentSectionProps> = ({
  group,
  assignmentsMap,
  employees,
  offices,
  contacts,
  officeContacts,
  canShowNoEmployeeWarning = true,
  selectedIds,
  fulfilmentDatesByEmployee,
  deviceSetupsByUnit,
  duplicateMap,
  crossCountryByUnitId,
  onToggleCountrySelection,
  onRemoveCountry,
  onToggleSelect,
  onAssignDestination,
  onAssignAllInCountry,
  onSetOfficeDefaultContact,
  onSetOfficeContact,
  onAssignEmployee,
  onAssignStorage,
  onAddEmployeeAction,
  onSetFulfilmentDate,
  onSetDeviceSetup,
  onRemoveUnit,
}) => {
  const currencySymbol = useWorkspaceCurrencySymbol();
  const selectedSelectableCount = group.allUnitIds.filter((id) =>
    selectedIds.has(id),
  ).length;
  const isSelectAllDisabled = group.allUnitIds.length === 0;
  const isSelectAllChecked =
    !isSelectAllDisabled && selectedSelectableCount === group.allUnitIds.length;
  const isSelectAllIndeterminate =
    !isSelectAllDisabled && selectedSelectableCount > 0 && !isSelectAllChecked;
  const countryUnits = group.allUnitIds
    .map((id) => assignmentsMap.get(id))
    .filter((unit): unit is AssignmentUnit => Boolean(unit));
  const officeInCountry = officesInCountry(
    offices,
    group.country.label,
    group.country.code,
  ).find(isBuyableOffice);
  const officeContact = officeInCountry
    ? contacts[officeInCountry.id]
    : undefined;
  const countrySummary = summariseUnits(countryUnits);
  const isUntouched = countrySummary.unassigned === countrySummary.total;

  const handleToggleSelectAll = () => {
    onToggleCountrySelection(group.allUnitIds);
  };

  const bulkPicker = (
    <CountryBulkDestination
      units={countryUnits}
      countryLabel={group.country.label}
      countryCode={group.country.code}
      employees={employees}
      offices={offices}
      contacts={contacts}
      officeContacts={officeContacts}
      onAssignAll={onAssignAllInCountry}
      onSetOfficeContact={onSetOfficeDefaultContact}
    />
  );

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-2xl border border-secondary bg-primary shadow-xs">
      <AssignmentGroupHeader
        countryCode={group.country.code}
        countryLabel={group.country.label}
        summary={countrySummary}
        isSelectAllChecked={isSelectAllChecked}
        isSelectAllIndeterminate={isSelectAllIndeterminate}
        onToggleSelectAll={handleToggleSelectAll}
        actionSlot={isUntouched ? null : bulkPicker}
      />

      {isUntouched && (
        <AssignmentGroupInvite
          countryLabel={group.country.label}
          count={group.allUnitIds.length}
        >
          {bulkPicker}
        </AssignmentGroupInvite>
      )}

      {canShowNoEmployeeWarning && employees.length === 0 && (
        <div className="px-5 pt-4">
          <NoEmployeeCountryWarning
            countryLabel={group.country.label}
            officeName={officeInCountry?.name}
            onSendToOffice={
              officeInCountry
                ? () =>
                    onAssignAllInCountry({
                      type: "office",
                      officeId: officeInCountry.id,
                      officeName: officeInCountry.name,
                      contactEmployeeId: officeContact?.contactEmployeeId ?? "",
                      contactEmployeeName:
                        officeContact?.contactEmployeeName ?? "",
                    })
                : undefined
            }
            onClear={onRemoveCountry}
          />
        </div>
      )}

      <AssignmentColumnHeader />

      {group.allUnitIds.map((unitId, index) => {
        const unit = assignmentsMap.get(unitId);
        if (!unit) {
          return null;
        }

        const duplicateKey =
          unit.destination.type === "employee"
            ? `${unit.cartItem.pricing.id}-${unit.destination.employeeId}`
            : "";
        const crossCountry = crossCountryByUnitId.get(unit.unitId);

        return (
          <DeviceRow
            key={unit.unitId}
            unit={unit}
            employees={employees}
            offices={offices}
            contacts={contacts}
            officeContacts={officeContacts}
            isLast={index === group.allUnitIds.length - 1}
            isSelected={selectedIds.has(unit.unitId)}
            isDuplicate={(duplicateMap.get(duplicateKey) || 0) > 1}
            crossCountry={
              crossCountry
                ? {
                    deviceCountry: crossCountry.deviceCountry,
                    employeeCountry: crossCountry.employeeCountry,
                  }
                : undefined
            }
            onToggleSelect={() => onToggleSelect(unit.unitId)}
            onAssignDestination={(destination) =>
              onAssignDestination(unit.unitId, destination)
            }
            onAssignEmployee={(employeeId, employeeName) =>
              onAssignEmployee(unit.unitId, employeeId, employeeName)
            }
            onAssignStorage={() => onAssignStorage(unit.unitId)}
            onSetOfficeContact={(
              contactEmployeeId,
              contactEmployeeName,
              source,
            ) =>
              onSetOfficeContact(
                unit.unitId,
                contactEmployeeId,
                contactEmployeeName,
                source,
              )
            }
            onAddEmployeeAction={() => onAddEmployeeAction(unit.unitId)}
            fulfilmentDate={
              unit.destination.type === "employee"
                ? fulfilmentDatesByEmployee[unit.destination.employeeId]
                : fulfilmentDatesByEmployee[unit.unitId]
            }
            deviceSetup={deviceSetupsByUnit[unit.unitId]}
            onSetFulfilmentDate={onSetFulfilmentDate}
            onSetDeviceSetup={onSetDeviceSetup}
            onRemove={() => onRemoveUnit(unit.unitId)}
          />
        );
      })}

      <div className="flex items-center justify-between gap-4 border-t border-secondary bg-secondary px-5 py-3">
        <span className="text-xs text-tertiary">
          {countrySummary.unassigned > 0
            ? `${countrySummary.unassigned} still ${
                countrySummary.unassigned === 1 ? "needs" : "need"
              } a destination`
            : "All assigned"}
        </span>
        <span className="font-mono text-xs font-semibold tabular-nums text-primary">
          {currencySymbol}
          {formatAmount(countrySummary.subtotal)}
        </span>
      </div>
    </section>
  );
};

export default CountryAssignmentSection;
