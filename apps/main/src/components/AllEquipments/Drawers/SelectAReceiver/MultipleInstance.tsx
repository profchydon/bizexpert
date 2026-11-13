import React, { FC } from "react";
import EquipmentWrapper from "../EquipmentWrapper";
import Autocomplete, { SingleSelectValue } from "@/components/ui/autocomplete";
import { Offboard_asset } from "@/types/offboarding";
import useKeyGenerator from "@/hooks/useKeyGenerator";
import { UserIcon } from "lucide-react";

interface FormattedItem {
  value: string;
  label: string;
}

interface Props {
  employeeDataOptions: FormattedItem[];
  offboardingData: Offboard_asset[];
  selectedEmployeeValue: Record<string, SingleSelectValue | null>;
  setSelectedEmployeeValue: (value: SingleSelectValue | null) => void;
}

const MultipleInstance: FC<Props> = ({
  employeeDataOptions,
  offboardingData,
  selectedEmployeeValue,
  setSelectedEmployeeValue,
}) => {
  const filterEmployee = (currentEmployee: string) => {
    const empOptions = currentEmployee
      ? employeeDataOptions?.filter((emp) => emp.value !== currentEmployee)!
      : employeeDataOptions!;
    return empOptions;
  };

  return (
    <div className="flex flex-col gap-3">
      {offboardingData?.map((item) => {
        if (item?.actionType === "Transfer" || !item?.actionType) {
          const defaultReceiver =
            employeeDataOptions.find(
              (emp) => emp.value === item?.receiver?.id,
            ) || null;
          const { internalKey, generateKey } = useKeyGenerator();
          return (
            <EquipmentWrapper name={`${item?.title}`} key={item?.id}>
              <div className="w-full">
                <Autocomplete
                  externalKey={internalKey}
                  options={filterEmployee(item?.assignee?.id as string)}
                  // @ts-ignore
                  setSelectedOption={(value) =>
                    setSelectedEmployeeValue(
                      item?.id,
                      // @ts-ignore
                      value as SingleSelectValue,
                    )
                  }
                  selectedOption={
                    selectedEmployeeValue?.[item?.id] || defaultReceiver
                  }
                  isSearchable
                  placeholder="Select receiver"
                  placeholderIcon={<UserIcon />}
                  isClearable={true}
                  portalInBody={false}
                  data-testid="multipleinstance-autocomplete"
                />
              </div>
            </EquipmentWrapper>
          );
        }
      })}
    </div>
  );
};

export default MultipleInstance;
