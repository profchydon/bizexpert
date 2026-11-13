import FormField from "@/components/Custom/FormField";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { removeUserscore } from "@/utils/underScoreTransformer";
import type { Control } from "react-hook-form";
import { z } from "zod";
import { signupFormSchema } from "./validation";

type SignupFormValues = z.infer<typeof signupFormSchema>;

export function EmployeeInviteEmployeeDetailsFields({
  control,
}: {
  control: Control<SignupFormValues>;
}) {
  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-3">
        <FormField
          control={control}
          name="job_title"
          label="Job Title"
          className="min-w-0"
          render={({ field: { onChange, ...restField } }) => (
            <Input
              placeholder="Enter job title"
              {...restField}
              onChange={(e) => {
                onChange(e.target.value);
              }}
              data-testid="employeeinviteemployeedetailsfields-input"
            />
          )}
        />

        <FormField
          control={control}
          name="employment_type"
          label="Employment type"
          className="min-w-0"
          render={({ field: { onChange, value, ...restField } }) => (
            <Select
              {...restField}
              onValueChange={(value) => {
                onChange(value);
              }}
              defaultValue={value}
              value={value}
              data-testid="employeeinviteemployeedetailsfields-select"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employment type" />
              </SelectTrigger>

              <SelectContent>
                {["Contract", "Part_Time", "Full_Time", "Others"].map(
                  (value) => (
                    <SelectItem value={value} key={value}>
                      {removeUserscore(value)}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <FormField
        control={control}
        name="address"
        label="Address"
        render={({ field }) => (
          <Input
            placeholder="Enter Address"
            {...field}
            data-ph-mask
            data-testid="employeeinviteemployeedetailsfields-input-2"
          />
        )}
      />
    </>
  );
}
