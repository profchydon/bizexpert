"use client";

import { Mail } from "lucide-react";
import Image from "next/image";
import { logo_black } from "@/assets/images";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store";
import { VerifyForm } from "./VerifyForm";

export default function NewOnboardingCheckEmail() {
  const { user } = useAppSelector(
    (state) => state.persistedReducers.onboarding,
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="absolute top-8 left-1/2 -translate-x-1/2">
        <Image src={logo_black} alt="Rayda" className="h-8 w-auto" priority />
      </div>
      <div className="w-full max-w-[400px] rounded-2xl bg-white px-8 py-10 shadow-lg ring-1 ring-gray-200">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 ring-8 ring-primary-25">
          <Mail className="size-7 text-primary-600" />
        </div>
        <div className="mt-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Check your email</h1>
          <p className="mt-3 text-base leading-6 text-gray-500">
            We sent a verification code to
          </p>
          <p className="mt-1 font-semibold text-gray-700">{user?.email}</p>
        </div>

        <VerifyForm />

        <p className="mt-6 text-center text-sm text-gray-500">
          Didn&apos;t receive the email? Check your spam folder.
        </p>
        <div className="mt-8 flex justify-center border-t border-gray-200 pt-6">
          <Button
            asChild
            variant="link"
            size="sm"
            className="h-auto p-0 text-sm text-gray-600"
            data-testid="checkemail-button"
          >
            <a href="/onboarding">← Back to sign up</a>
          </Button>
        </div>
      </div>
      <p className="mt-8 text-sm text-gray-400">
        © {new Date().getFullYear()} Rayda. All rights reserved.
      </p>
    </div>
  );
}
