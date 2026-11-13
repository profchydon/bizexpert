import Loader from "@/components/Loader";
import type { Office } from "@/container/Dashboard/Accounts/types";
import type { OfficeDeliveryContact } from "@/api/baseQueries/companiesApi/officesApi/getDeliveryContacts";
import CountryAssignmentSection from "./CountryAssignmentSection";
import HolidayWarningBanner from "./HolidayWarningBanner";
import { NigeriaHoliday } from "../Marketplace/data/nigeriaHolidays";
import { CountryUnitGroup } from "./groupUnitsByCountry";
import {
  AssignmentDestination,
  AssignmentUnit,
  ContactSource,
  EmployeeOption,
} from "./types";
import type { OfficeContact } from "./officeContactRules";
import { CrossBorderPair } from "./crossCountry";

const SHOW_HOLIDAY_WARNING_BANNER = false;

interface AssignmentBodyProps {
  isDecisionDataReady: boolean;
  upcomingHoliday: NigeriaHoliday | null;
  groupedByCountry: CountryUnitGroup[];
  assignmentsMap: Map<string, AssignmentUnit>;
  getEmployeesForCountry: (countryCode: string) => EmployeeOption[];
  offices: Office[];
  contacts: Record<
    string,
    { contactEmployeeId: string; contactEmployeeName: string }
  >;
  officeContacts: Record<string, OfficeDeliveryContact[]>;
  selectedIds: Set<string>;
  fulfilmentDatesByEmployee: Record<string, string>;
  deviceSetupsByUnit: Record<string, string>;
  duplicateMap: Map<string, number>;
  crossCountryByUnitId: Map<string, CrossBorderPair>;
  onToggleCountrySelection: (unitIds: string[]) => void;
  onRemoveCountry: (countryCode: string, unitIds: string[]) => void;
  onToggleSelect: (unitId: string) => void;
  onAssignDestination: (
    unitId: string,
    destination: AssignmentDestination,
  ) => void;
  onAssignAllInCountry: (
    countryCode: string,
    destination: AssignmentDestination,
  ) => void;
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

const AssignmentBody: React.FC<AssignmentBodyProps> = ({
  isDecisionDataReady,
  upcomingHoliday,
  groupedByCountry,
  assignmentsMap,
  getEmployeesForCountry,
  offices,
  contacts,
  officeContacts,
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
  if (!isDecisionDataReady) {
    return (
      <div className="flex min-h-[260px] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {SHOW_HOLIDAY_WARNING_BANNER && upcomingHoliday && (
        <div className="mt-3">
          <HolidayWarningBanner holiday={upcomingHoliday} />
        </div>
      )}

      <div className="mt-4 flex w-full min-w-0 flex-col gap-5">
        {groupedByCountry.map((group) => (
          <CountryAssignmentSection
            key={group.country.code}
            group={group}
            assignmentsMap={assignmentsMap}
            employees={getEmployeesForCountry(group.country.code)}
            offices={offices}
            contacts={contacts}
            officeContacts={officeContacts}
            canShowNoEmployeeWarning
            selectedIds={selectedIds}
            fulfilmentDatesByEmployee={fulfilmentDatesByEmployee}
            deviceSetupsByUnit={deviceSetupsByUnit}
            duplicateMap={duplicateMap}
            crossCountryByUnitId={crossCountryByUnitId}
            onToggleCountrySelection={onToggleCountrySelection}
            onRemoveCountry={() =>
              onRemoveCountry(group.country.code, group.allUnitIds)
            }
            onToggleSelect={onToggleSelect}
            onAssignDestination={onAssignDestination}
            onAssignAllInCountry={(destination) =>
              onAssignAllInCountry(group.country.code, destination)
            }
            onSetOfficeDefaultContact={onSetOfficeDefaultContact}
            onSetOfficeContact={onSetOfficeContact}
            onAssignEmployee={onAssignEmployee}
            onAssignStorage={onAssignStorage}
            onAddEmployeeAction={onAddEmployeeAction}
            onSetFulfilmentDate={onSetFulfilmentDate}
            onSetDeviceSetup={onSetDeviceSetup}
            onRemoveUnit={onRemoveUnit}
          />
        ))}
      </div>
    </>
  );
};

export default AssignmentBody;
