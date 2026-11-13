import { Button } from "@/components/ui/button";
import DestinationPicker from "./DestinationPicker";
import OfficeContactPicker from "./OfficeContactPicker";
import { EmployeeOption } from "./types";
import type { Office } from "@/container/Dashboard/Accounts/types";
import type { OfficeDeliveryContact } from "@/api/baseQueries/companiesApi/officesApi/getDeliveryContacts";
import type { AssignmentDestination } from "./types";
import type { OfficeContact } from "./officeContactRules";
import { DatePicker } from "@/components/ui/date-picker";
import dayjs from "dayjs";
import SetupPicker from "./SetupPicker";
import type { SetupOption } from "./deviceSetup";
import InactiveCell from "./InactiveCell";

interface BatchActionBarProps {
  selectedCount: number;
  employees: EmployeeOption[];
  employeeCountryLabel: string | null;
  employeeCountryCode?: string | null;
  offices: Office[];
  contacts: Record<
    string,
    { contactEmployeeId: string; contactEmployeeName: string }
  >;
  batchAssignedEmployeeIds: string[];
  batchFulfilmentDate?: string;
  batchDeviceSetup?: string;
  batchSetupOptions: SetupOption[];
  batchMinFulfilmentDate?: Date;
  batchOffice?: Office | null;
  batchContactId?: string;
  allSelectedAreStorage?: boolean;
  officeDefault?: OfficeContact | null;
  officeContacts?: OfficeDeliveryContact[];
  onAssignDestination: (destination: AssignmentDestination) => void;
  onSetOfficeContact?: (contact: OfficeContact) => void;
  onAddEmployeeAction: () => void;
  onSetBatchFulfilmentDate: (fulfilmentDate: string) => void;
  onSetBatchDeviceSetup: (deviceSetup: string) => void;
  onClearSelection: () => void;
}

const BatchActionBar: React.FC<BatchActionBarProps> = ({
  selectedCount,
  employees,
  employeeCountryLabel,
  employeeCountryCode,
  offices,
  contacts,
  batchAssignedEmployeeIds,
  batchFulfilmentDate,
  batchDeviceSetup,
  batchSetupOptions,
  batchMinFulfilmentDate,
  batchOffice,
  batchContactId = "",
  allSelectedAreStorage = false,
  officeDefault,
  officeContacts = [],
  onAssignDestination,
  onSetOfficeContact,
  onAddEmployeeAction,
  onSetBatchFulfilmentDate,
  onSetBatchDeviceSetup,
  onClearSelection,
}) => {
  const canSetBatchFulfilmentDate =
    batchAssignedEmployeeIds.length > 0 || Boolean(batchOffice);

  if (selectedCount < 2) {
    return null;
  }

  const parsedBatchFulfilmentDate = batchFulfilmentDate
    ? dayjs(batchFulfilmentDate).toDate()
    : undefined;

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-lg border border-primary-200 bg-primary-50 px-4 py-3">
      <span className="text-sm font-medium text-gray-900">
        {selectedCount} selected
      </span>

      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-5 gap-y-3">
        {employeeCountryLabel ? (
          <div className="w-[260px]">
            <DestinationPicker
              employees={employees}
              offices={offices}
              contacts={contacts}
              countryLabel={employeeCountryLabel}
              countryCode={employeeCountryCode ?? undefined}
              ariaLabel={`Send the ${selectedCount} selected devices to`}
              placeholder="Person, office or storage"
              onAssign={onAssignDestination}
              onAddEmployeeAction={onAddEmployeeAction}
            />
          </div>
        ) : (
          <span className="text-sm text-gray-500">
            Select devices from one country to send them together.
          </span>
        )}

        {batchOffice && onSetOfficeContact && (
          <div className="w-[220px]">
            <OfficeContactPicker
              contacts={officeContacts}
              contactEmployeeId={batchContactId}
              officeDefault={officeDefault}
              placeholder="Who receives this delivery"
              onSelect={onSetOfficeContact}
            />
          </div>
        )}

        {allSelectedAreStorage ? (
          <div className="w-[220px]">
            <InactiveCell
              label="Not applicable"
              tooltip="Nothing is being delivered to anyone. The device waits in the warehouse until you deploy it."
            />
          </div>
        ) : (
          <DatePicker
            className="h-9 w-[220px]"
            date={parsedBatchFulfilmentDate as Date}
            placeHolder="Pick a date"
            disablePastDates
            minDate={batchMinFulfilmentDate}
            disabled={!canSetBatchFulfilmentDate}
            setDate={(value) => {
              onSetBatchFulfilmentDate(dayjs(value).format("YYYY-MM-DD"));
            }}
          />
        )}

        {batchSetupOptions.length > 0 && (
          <div className="w-[220px]">
            <SetupPicker
              options={batchSetupOptions}
              value={batchDeviceSetup}
              ariaLabel={`Setup for the ${selectedCount} selected devices`}
              onChange={onSetBatchDeviceSetup}
            />
          </div>
        )}
      </div>

      <Button
        size="sm"
        variant="ghost"
        onClick={onClearSelection}
        data-testid="batchactionbar-button"
      >
        Clear selection
      </Button>
    </div>
  );
};

export default BatchActionBar;
