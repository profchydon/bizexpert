"use client";

import { User01 } from "@untitledui/icons";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import type { addSingleEquipmentSchema } from "./SingleEquipment/validation";

type FormValues = z.infer<typeof addSingleEquipmentSchema>;

type EmployeeOption = {
  value: string;
  label: string;
};

type Props = {
  form: UseFormReturn<FormValues>;
  employeeOptions: EmployeeOption[];
};

const STATUS_ITEMS = [
  { id: "unassigned", label: "Unassigned" },
  { id: "Assigned", label: "Assigned" },
];

export const SingleEquipmentAddExtraFields = ({
  form,
  employeeOptions,
}: Props) => {
  const status = form.watch("status");
  const employeeItems = employeeOptions.map((option) => ({
    id: option.value,
    label: option.label,
  }));

  return (
    <>
      <Controller
        control={form.control}
        name="status"
        render={({ field }) => (
          <Select
            label="Asset status"
            size="md"
            placeholder="Asset status"
            selectedKey={field.value ? String(field.value) : null}
            onSelectionChange={(key) => field.onChange(String(key ?? ""))}
            items={STATUS_ITEMS}
            data-testid="singleequipmentaddextrafields-select"
          >
            {(item) => <Select.Item {...item} />}
          </Select>
        )}
      />
      {status === "Assigned" ? (
        <Controller
          control={form.control}
          name="assignee"
          render={({ field }) => (
            <div className="col-span-2">
              <Select.ComboBox
                label="Select assignee"
                size="md"
                placeholder="Select assignee"
                shortcut={false}
                icon={User01}
                selectedKey={field.value ? String(field.value) : null}
                onSelectionChange={(key) => field.onChange(String(key ?? ""))}
                items={employeeItems}
                data-testid="singleequipment-assignee"
              >
                {(item) => <Select.Item {...item} />}
              </Select.ComboBox>
            </div>
          )}
        />
      ) : null}
      <Controller
        control={form.control}
        name="description"
        render={({ field }) => (
          <div className="col-span-2">
            <Input
              size="md"
              label="Description (optional)"
              placeholder="Enter description"
              value={String(field.value ?? "")}
              onChange={field.onChange}
              onBlur={field.onBlur}
              data-testid="singleequipmentaddextrafields-input"
            />
          </div>
        )}
      />
    </>
  );
};
