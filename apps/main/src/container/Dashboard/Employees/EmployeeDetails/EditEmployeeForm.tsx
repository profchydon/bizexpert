"use client";

import type { SelectItemType } from "@/components/base/select/select";
import type { UseFormReturn } from "react-hook-form";
import type { EditEmployeeFormValues } from "./buildEditEmployeeFormData";
import { EditEmployeeIdentityFields } from "./EditEmployeeIdentityFields";
import { EditEmployeeLocationFields } from "./EditEmployeeLocationFields";
import { EditEmployeeRoleFields } from "./EditEmployeeRoleFields";

type Props = {
  form: UseFormReturn<EditEmployeeFormValues>;
  employeeId: string;
  canEditAddress: boolean;
  emailReadOnly?: boolean;
  lockCountry?: boolean;
  freeTextAddress?: boolean;
  managerLabel?: string;
  departmentItems: SelectItemType[];
  levelItems: SelectItemType[];
  countryItems: SelectItemType[];
  countryRequired?: boolean;
};

const EditEmployeeForm = ({
  form,
  employeeId,
  canEditAddress,
  emailReadOnly = true,
  lockCountry = false,
  freeTextAddress = false,
  managerLabel,
  departmentItems,
  levelItems,
  countryItems,
  countryRequired = false,
}: Props) => {
  return (
    <div className="flex flex-col gap-4 p-6">
      <EditEmployeeIdentityFields form={form} emailReadOnly={emailReadOnly} />
      <EditEmployeeRoleFields
        form={form}
        employeeId={employeeId}
        canEditAddress={canEditAddress}
        lockCountry={lockCountry}
        managerLabel={managerLabel}
        departmentItems={departmentItems}
        levelItems={levelItems}
        countryItems={countryItems}
        countryRequired={countryRequired}
      />
      <EditEmployeeLocationFields
        form={form}
        canEditAddress={canEditAddress}
        freeTextAddress={freeTextAddress}
      />
    </div>
  );
};

export default EditEmployeeForm;
