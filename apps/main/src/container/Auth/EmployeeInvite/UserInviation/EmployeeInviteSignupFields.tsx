import FormField from "@/components/Custom/FormField";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { PhoneInput } from "@/components/ui/phone-input";
import PasswordChecklist from "react-password-checklist";
import type { Control } from "react-hook-form";
import { z } from "zod";
import { EmployeeInviteEmployeeDetailsFields } from "./EmployeeInviteEmployeeDetailsFields";
import { signupFormSchema } from "./validation";

type SignupFormValues = z.infer<typeof signupFormSchema>;

interface Props {
  control: Control<SignupFormValues>;
  password: string;
  setPassword: (value: string) => void;
  setIsPasswordValid: (value: boolean) => void;
}

export function EmployeeInviteSignupFields({
  control,
  password,
  setPassword,
  setIsPasswordValid,
}: Props) {
  return (
    <div className="mt-2 flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-3">
        <FormField
          control={control}
          name="first_name"
          label="First Name"
          className="min-w-0"
          render={({ field }) => (
            <Input
              placeholder="Enter your first name"
              {...field}
              data-testid="employeeinvitesignupfields-input"
            />
          )}
        />

        <FormField
          control={control}
          name="last_name"
          label="Last Name"
          className="min-w-0"
          render={({ field }) => (
            <Input
              placeholder="Enter your last name"
              {...field}
              data-testid="employeeinvitesignupfields-input-2"
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-3">
        <FormField
          control={control}
          name="email"
          label="Work email"
          className="min-w-0"
          render={({ field }) => (
            <Input
              placeholder="Enter your work email"
              disabled
              readOnly
              {...field}
              data-testid="employeeinvitesignupfields-input-3"
            />
          )}
        />

        <FormField
          control={control}
          name="phone"
          label="Phone number"
          className="min-w-0"
          render={({ field }) => (
            <PhoneInput
              className="w-full"
              value={field.value}
              onChange={(value) => field.onChange(value)}
            />
          )}
        />
      </div>

      <EmployeeInviteEmployeeDetailsFields control={control} />

      <FormField
        control={control}
        name="password"
        label="Password"
        render={({ field: { onChange, ...rest } }) => (
          <PasswordInput
            onChange={(e) => {
              onChange(e.target.value);
              setPassword(e.target.value);
            }}
            {...rest}
          />
        )}
      />

      <PasswordChecklist
        rules={["minLength", "capitalAndLowercase", "number", "specialChar"]}
        minLength={6}
        value={password}
        messages={{
          minLength: "Must be 6-characters or more",
          capitalAndLowercase: "Must contain both uppercase and lowercase",
          number: " Must contain a number",
          specialChar: "Must contain a special character",
        }}
        className="flex flex-col gap-y-1 text-xs font-ibmPlexSans"
        iconSize={10}
        onChange={(isValid) => setIsPasswordValid(isValid)}
      />
    </div>
  );
}
