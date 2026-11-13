"use client";

import { type FormEvent, useState } from "react";
import { useLoginAuthorizationMutation } from "@/api/baseQueries/authFlowApi/loginAuthorization";
import { useSignupMutation } from "@/api/baseQueries/authFlowApi/signup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { PhoneInput } from "@/components/ui/phone-input";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useAppDispatch } from "@/store";
import { setOnboardingData } from "@/store/slices/onboardingSlice";
import { clearClientAuthSession } from "@/utils/auth/clearClientAuthSession";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { showApiError } from "@/utils/showApiError";
import { trackSignupStarted } from "@/lib/activationAnalytics";

interface FormState {
  first_name: string;
  last_name: string;
  password: string;
  phone: string;
  email: string;
}

export function SignupForm() {
  const dispatch = useAppDispatch();
  const { push, isPending } = useTransitionRouter();
  const [signup, signupProps] = useSignupMutation();
  const [loginAuthorization, loginProps] = useLoginAuthorizationMutation();
  const [formData, setFormData] = useState<FormState>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
  });
  const isValid =
    formData.first_name.trim() &&
    formData.last_name.trim() &&
    formData.email.trim() &&
    formData.password.length >= 8;

  async function handleSignIn() {
    clearClientAuthSession(dispatch, { preservePostLoginRedirect: true });

    try {
      const session = await loginAuthorization().unwrap();
      globalThis.location.assign(session.data.redirect_url);
    } catch (error) {
      showApiError(error);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isValid) return;

    try {
      const response = await signup({
        user: formData,
        company: { email: formData.email, phone: formData.phone },
        skipDomainCheck: true,
      }).unwrap();

      dispatch(
        setOnboardingData({
          user: response?.data?.user,
          company: response?.data?.company,
        }),
      );
      displaySuccessMessage("Account created successfully");
      trackSignupStarted();
      push("/onboarding/check-email");
    } catch {}
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="mb-1.5 block text-sm font-normal text-gray-700">
            First Name
          </label>
          <Input
            placeholder="Enter your first name"
            value={formData.first_name}
            onChange={(event) =>
              setFormData((items) => ({
                ...items,
                first_name: event.target.value,
              }))
            }
            data-testid="signupform-input"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1.5 block text-sm font-normal text-gray-700">
            Last Name
          </label>
          <Input
            placeholder="Enter your last name"
            value={formData.last_name}
            onChange={(event) =>
              setFormData((items) => ({
                ...items,
                last_name: event.target.value,
              }))
            }
            data-testid="signupform-input-2"
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-normal text-gray-700">
          Work email
        </label>
        <Input
          type="email"
          placeholder="you@company.com"
          value={formData.email}
          onChange={(event) =>
            setFormData((items) => ({
              ...items,
              email: event.target.value,
            }))
          }
          data-testid="signupform-input-3"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-normal text-gray-700">
          Phone number
        </label>
        <PhoneInput
          value={formData.phone}
          onChange={(value) =>
            setFormData((items) => ({ ...items, phone: value ?? "" }))
          }
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-normal text-gray-700">Password</label>
        <PasswordInput
          placeholder="Min. 8 characters"
          value={formData.password}
          onChange={(event) =>
            setFormData((items) => ({ ...items, password: event.target.value }))
          }
        />
        <p className="text-sm text-gray-500">Must be at least 8 characters.</p>
      </div>
      <Button
        type="submit"
        size="lg"
        className="mt-1 w-full"
        disabled={!isValid}
        isLoading={signupProps.isLoading || isPending}
        data-testid="signupform-button"
      >
        Get started
      </Button>
      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Button
          type="button"
          variant="link"
          size="sm"
          className="h-auto p-0 font-semibold text-primary-700 hover:text-primary-600"
          isLoading={loginProps.isLoading}
          onClick={handleSignIn}
          data-testid="signupform-button-2"
        >
          Sign in
        </Button>
      </p>
    </form>
  );
}
