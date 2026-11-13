import type { Office } from "@/container/Dashboard/Accounts/types";
import type { OfficeDeliveryContact } from "@/api/baseQueries/companiesApi/officesApi/getDeliveryContacts";
import DestinationPicker from "./DestinationPicker";
import OfficeContactPicker from "./OfficeContactPicker";
import { uniformDestination } from "./destinationItems";
import { officeDefaultContact, type OfficeContact } from "./officeContactRules";
import type {
  AssignmentDestination,
  AssignmentUnit,
  EmployeeOption,
} from "./types";

interface CountryBulkDestinationProps {
  units: AssignmentUnit[];
  countryLabel: string;
  countryCode: string;
  employees: EmployeeOption[];
  offices: Office[];
  contacts: Record<
    string,
    { contactEmployeeId: string; contactEmployeeName: string }
  >;
  officeContacts: Record<string, OfficeDeliveryContact[]>;
  onAssignAll: (destination: AssignmentDestination) => void;
  onSetOfficeContact: (officeId: string, contact: OfficeContact) => void;
}

const CountryBulkDestination: React.FC<CountryBulkDestinationProps> = ({
  units,
  countryLabel,
  countryCode,
  employees,
  offices,
  contacts,
  officeContacts,
  onAssignAll,
  onSetOfficeContact,
}) => {
  const shared = uniformDestination(units);
  const office =
    shared?.type === "office"
      ? offices.find((candidate) => candidate.id === shared.officeId)
      : undefined;
  const officeDefault = office ? officeDefaultContact(units, office.id) : null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="w-[280px] max-w-full">
        <DestinationPicker
          destination={shared}
          employees={employees}
          offices={offices}
          contacts={contacts}
          countryLabel={countryLabel}
          countryCode={countryCode}
          ariaLabel={`Send every device in ${countryLabel} to`}
          placeholder={`Send all ${units.length} to...`}
          onAssign={onAssignAll}
        />
      </div>
      {office && officeDefault && (
        <div className="relative w-[200px] max-w-full min-w-0">
          <span className="absolute -top-2 left-2.5 z-10 bg-secondary px-1 text-[10px] font-semibold uppercase leading-4 tracking-wide text-quaternary">
            Received by
          </span>
          <OfficeContactPicker
            contacts={officeContacts[office.id] ?? []}
            contactEmployeeId={officeDefault.contactEmployeeId}
            officeDefault={officeDefault}
            onSelect={(contact) => onSetOfficeContact(office.id, contact)}
          />
        </div>
      )}
    </div>
  );
};

export default CountryBulkDestination;
