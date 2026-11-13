import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import PasswordChecklist from "react-password-checklist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { PasswordInput } from "@/components/ui/password-input";
import FormField from "@/components/Custom/FormField";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { signupFormSchema } from "./validation";

type SignupFormValues = z.infer<typeof signupFormSchema>;

type Props = {
  form: UseFormReturn<SignupFormValues>;
  password: string;
  isPasswordValid: boolean;
  isPasswordFieldFocused: boolean;
  isSubmitting: boolean;
  isLoginLoading: boolean;
  onPasswordChange: (value: string) => void;
  onPasswordFocus: () => void;
  onPasswordValidChange: (isValid: boolean) => void;
  onLogin: () => void;
  onSubmit: (data: SignupFormValues) => void;
};

const SignupForm = ({
  form,
  password,
  isPasswordValid,
  isPasswordFieldFocused,
  isSubmitting,
  isLoginLoading,
  onPasswordChange,
  onPasswordFocus,
  onPasswordValidChange,
  onLogin,
  onSubmit,
}: Props) => (
  <div className="lg:grid px-10 sm:px-24 lg:px-0 place-content-center 2xl:py-0 sm:py-[70px] 2xl:h-screen">
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full lg:min-w-[27rem]"
      >
        <div className="flex-col flex gap-y-2 mb-6">
          <div className="lg:text-3xl text-2xl font-semibold text-gray-900">
            Sign up
          </div>
          <span className="text-base text-gray-600">
            Get started with Rayda Remote
          </span>
        </div>

        <div className="flex flex-col gap-5 mt-8">
          <div className="md:flex md:gap-x-3 gap-5 flex-col md:flex-row w-auto">
            <FormField
              control={form.control}
              name="first_name"
              label="First Name"
              render={({ field }) => (
                <Input
                  placeholder="Enter your first name"
                  {...field}
                  className="mb-4 lg:mb-0 lg:w-[220px]"
                  data-testid="signupform-input"
                />
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              label="Last Name"
              render={({ field }) => (
                <Input
                  placeholder="Enter your last name"
                  {...field}
                  className="lg:mb-0 lg:w-[220px]"
                  data-testid="signupform-input-2"
                />
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            label="Work email"
            render={({ field }) => (
              <Input
                placeholder="Enter your work email"
                {...field}
                data-testid="signupform-input-3"
              />
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            label="Phone number"
            render={({ field }) => (
              <PhoneInput onChange={(value) => field.onChange(value)} />
            )}
          />

          <FormField
            control={form.control}
            name="password"
            label="Password"
            render={({ field: { onChange, ...rest } }) => (
              <PasswordInput
                onFocus={onPasswordFocus}
                onChange={(e) => {
                  onChange(e.target.value);
                  onPasswordChange(e.target.value);
                }}
                {...rest}
              />
            )}
          />

          {isPasswordFieldFocused ? (
            <PasswordChecklist
              rules={[
                "minLength",
                "capitalAndLowercase",
                "number",
                "specialChar",
              ]}
              minLength={6}
              value={password}
              messages={{
                minLength: "Must be 6-characters or more",
                capitalAndLowercase:
                  "Must contain both uppercase and lowercase",
                number: " Must contain a number",
                specialChar: "Must contain a special character",
              }}
              className="flex flex-col gap-y-1 text-xs font-ibmPlexSans"
              iconSize={10}
              onChange={onPasswordValidChange}
            />
          ) : null}
        </div>

        <Button
          variant="primary"
          className="w-full mt-6"
          disabled={!form.formState.isValid || !isPasswordValid || isSubmitting}
          data-testid="signupform-button"
        >
          Get started
        </Button>

        <div className="mt-8 text-center" onClick={onLogin}>
          <span className="text-sm font-normal"> Already have an account?</span>{" "}
          <span
            className={cn(
              "cursor-pointer font-medium text-primary-700",
              isLoginLoading && "pointer-events-none text-gray-600 opacity-50",
            )}
          >
            Log in
          </span>
        </div>
      </form>
    </Form>
  </div>
);

export default SignupForm;
