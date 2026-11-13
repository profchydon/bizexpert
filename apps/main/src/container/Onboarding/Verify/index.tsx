"use client";

import { verify_double_icon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { otpSchema } from "./validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useResendOtpMutation } from "@/api/baseQueries/authFlowApi/resendOtp";
import { useVerifyOtpMutation } from "@/api/baseQueries/authFlowApi/verifyOtp";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { setOnboardingData } from "@/store/slices/onboardingSlice";
import { IUser } from "@/types/auth";
import FormField from "@/components/Custom/FormField";

interface Props {
  onContinue: () => void;
}

const Verify: React.FC<Props> = ({ onContinue }) => {
  const dispatch = useAppDispatch();
  const { user, company } = useAppSelector(
    (state) => state.persistedReducers.onboarding,
  );

  const [seconds, setSeconds] = useState(60);
  const [isCounting, setIsCounting] = useState(false);

  const [resendOtp, resendOtpProps] = useResendOtpMutation();
  const [verifyOtp, verifyOtpProps] = useVerifyOtpMutation();

  const startCountdown = () => {
    setIsCounting(true);
    setSeconds(60);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isCounting && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }

    if (seconds === 0) {
      setIsCounting(false);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isCounting, seconds]);

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof otpSchema>) => {
    const body = {
      otp: data.otp!,
      userId: user?.id!,
    };

    await verifyOtp(body)
      .unwrap()
      .then((res) => {
        dispatch(
          setOnboardingData({
            company: company,
            user: {
              ...user,
              stage: "Company Details",
            } as IUser,
          }),
        );
        displaySuccessMessage("Account successfully verified");
        onContinue();
      });
  };

  const handleResendOtp = async () => {
    await resendOtp({ email: user?.email! })
      .unwrap()
      .then((res) => {
        displaySuccessMessage(res.message);
        startCountdown();
      });
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-md flex flex-col justify-center items-center px-4">
        <Image
          src={verify_double_icon}
          alt="verify_double_icon"
          width={56}
          height={56}
        />

        <div className="flex flex-col space-y-3 mt-[1.5rem] text-center">
          <p className="text-[1.875rem] font-semibold text-gray-900">
            Check your work email
          </p>
          <p className="text-gray-600 font-light">
            We sent a verification link to {(user && user?.email) || ""}
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-3"
          >
            <FormField
              control={form.control}
              name="otp"
              label=""
              render={({ field }) => (
                <InputOTP maxLength={4} {...field}>
                  <InputOTPGroup className="w-full flex justify-center gap-4">
                    <InputOTPSlot
                      index={0}
                      className="rounded-lg border-2 h-16 w-16 text-center text-regular"
                    />
                    <InputOTPSlot
                      index={1}
                      className="rounded-lg border-2  h-16 w-16 text-center text-regular"
                    />
                    <InputOTPSlot
                      index={2}
                      className="rounded-lg border-2  h-16 w-16 text-center text-regular"
                    />
                    <InputOTPSlot
                      index={3}
                      className="rounded-lg border-2  h-16 w-16 text-center text-regular"
                    />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              variant="primary"
              disabled={verifyOtpProps.isLoading}
              data-testid="verify-button"
            >
              Verify email
            </Button>
          </form>
        </Form>

        <p className="text-sm font-normal text-gray-600 mt-4">
          Didn’t receive the email?{" "}
          <span
            onClick={() => {
              if (!isCounting) {
                handleResendOtp();
              }
            }}
            className={cn("text-center font-semibold cursor-pointer", {
              "pointer-events-none cursor-not-allowed text-gray-600 opacity-60":
                (!resendOtpProps.isLoading && isCounting) ||
                resendOtpProps.isLoading,
              "text-primary-700": !resendOtpProps.isLoading && !isCounting,
            })}
          >
            {!isCounting
              ? "Click to resend"
              : `Resend OTP in ${seconds} seconds`}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Verify;
