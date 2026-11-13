import { Control } from "react-hook-form";
import { z } from "zod";
import FormField from "@/components/Custom/FormField";
import DepartmentField from "@/components/DepartmentField";
import LevelField from "@/components/LevelField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { removeUserscore } from "@/utils/underScoreTransformer";
import { addNewEmployeeSchema } from "./validation";

type FormValues = z.infer<typeof addNewEmployeeSchema>;

type DepartmentOption = { value: string; label: string };

type Props = {
  control: Control<FormValues>;
  departmentOptions: DepartmentOption[];
};

const AddNewEmployeeOrgFields = ({ control, departmentOptions }: Props) => (
  <>
    <FormField
      control={control}
      name="level"
      label="Level"
      render={({ field: { onChange } }) => (
        <LevelField onChange={(value) => onChange(value)} />
      )}
    />

    <FormField
      control={control}
      name="department_id"
      label="Department"
      render={({ field: { onChange, value } }) => {
        const defaultInstance = departmentOptions.find(
          (item) => item.value === value,
        );
        return (
          <DepartmentField
            onChange={(next) => onChange(next)}
            defaultValue={defaultInstance && (defaultInstance as never)}
          />
        );
      }}
    />

    <FormField
      control={control}
      name="employment_type"
      label="Employment type"
      render={({ field: { onChange, value, ...restField } }) => (
        <Select
          {...restField}
          onValueChange={(next) => {
            onChange(next);
          }}
          defaultValue={value}
          data-testid="addnewemployeeorgfields-select"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select employment type" />
          </SelectTrigger>
          <SelectContent>
            {["Contract", "Part_Time", "Full_Time", "Others"].map((item) => (
              <SelectItem value={item} key={item}>
                {removeUserscore(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  </>
);

export default AddNewEmployeeOrgFields;
