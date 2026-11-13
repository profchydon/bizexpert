import DrawerRight from "@/components/DrawerRight";
import PageState from "@/components/PageState";
import { SingleSelectValue } from "@/components/ui/autocomplete";
import { IEmployees } from "@/types/employees";
import { Offboard_asset } from "@/types/offboarding";
import MultipleInstance from "./MultipleInstance";
import SingleInstance from "./SingleInstance";

type FormattedItem = {
  value: string;
  label: string;
};

type Props = {
  isOpen: boolean;
  isLoading?: boolean;
  isError?: boolean;
  isMultiple: boolean;
  selectedEmployeeValue?: string | Record<string, SingleSelectValue | null>;
  setSelectedEmployeeValue: (
    value: string | Record<string, SingleSelectValue | null> | undefined,
  ) => void;
  selectedCountyValue: SingleSelectValue | null;
  setSelectedCountyValue: (value: SingleSelectValue | null) => void;
  search: string | null;
  setSearch: (value: string | null) => void;
  employeeData: IEmployees[];
  countryKey: string;
  assigneeId?: string;
  empDataOptions: FormattedItem[];
  handleSelectedEmployeeChange: (
    id: string,
    value: SingleSelectValue | null,
  ) => void;
  offboardingRows: Offboard_asset[] | Offboard_asset;
  onCancel: () => void;
  onSave: () => void;
};

const SelectAReceiverDrawer = ({
  isOpen,
  isLoading,
  isError,
  isMultiple,
  selectedEmployeeValue,
  setSelectedEmployeeValue,
  selectedCountyValue,
  setSelectedCountyValue,
  search,
  setSearch,
  employeeData,
  countryKey,
  assigneeId,
  empDataOptions,
  handleSelectedEmployeeChange,
  offboardingRows,
  onCancel,
  onSave,
}: Props) => (
  <DrawerRight
    isOpen={isOpen}
    onClose={onCancel}
    onCancel={onCancel}
    onSave={onSave}
    saveText="Submit"
    isSaveButtonDisabled={!selectedEmployeeValue}
    drawerTitle="Select a receiver"
    drawerDescription="Please select employee to reassign equipment to"
    data-testid="selectareceiverdrawer-drawerright"
  >
    <PageState
      isLoading={(!isOpen || isLoading) as boolean}
      isError={isError as boolean}
    >
      {!isMultiple ? (
        <SingleInstance
          selectedCountyValue={selectedCountyValue}
          setSelectedCountyValue={setSelectedCountyValue}
          searchValue={search}
          setSearch={setSearch}
          employeeData={employeeData}
          selectedValue={selectedEmployeeValue as string}
          setSelectedValue={setSelectedEmployeeValue as any}
          countryKey={countryKey}
          assigneeId={assigneeId}
        />
      ) : (
        <MultipleInstance
          employeeDataOptions={empDataOptions}
          selectedEmployeeValue={selectedEmployeeValue as any}
          setSelectedEmployeeValue={handleSelectedEmployeeChange as any}
          offboardingData={offboardingRows as any}
        />
      )}
    </PageState>
  </DrawerRight>
);

export default SelectAReceiverDrawer;
