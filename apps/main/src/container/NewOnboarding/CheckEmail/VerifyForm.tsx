"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useLoginAuthorizationMutation } from "@/api/baseQueries/authFlowApi/loginAuthorization";
import { useResendOtpMutation } from "@/api/baseQueries/authFlowApi/resendOtp";
import { useVerifyOtpMutation } from "@/api/baseQueries/authFlowApi/verifyOtp";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAppSelector } from "@/store";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { useResendCountdown } from "./useResendCountdown";

const OTP_LENGTH = 4;

export function VerifyForm() {
  const { user } = useAppSelector(
    (state) => state.persistedReducers.onboarding,
  );
  const [otp, setOtp] = useState("");
  const countdown = useResendCountdown();

  const [verifyOtp, verifyProps] = useVerifyOtpMutation();
  const [resendOtp, resendProps] = useResendOtpMutation();
  const [loginAuthorization, loginProps] = useLoginAuthorizationMutation();

  async function handleVerify() {
    if (otp.length !== OTP_LENGTH || !user?.id) return;

    try {
      await verifyOtp({ otp, userId: user.id }).unwrap();
      displaySuccessMessage("Account successfully verified");
      const session = await loginAuthorization().unwrap();
      globalThis.location.assign(session.data.redirect_url);
    } catch {}
  }

  async function handleResend() {
    if (countdown.isCounting || !user?.email) return;

    try {
      const response = await resendOtp({ email: user.email }).unwrap();
      displaySuccessMessage(response.message);
      countdown.start();
    } catch {}
  }

  return (
    <div className="mt-8 flex flex-col gap-4">
      <InputOTP maxLength={OTP_LENGTH} value={otp} onChange={setOtp}>
        <InputOTPGroup className="flex w-full justify-center gap-3">
          {Array.from({ length: OTP_LENGTH }).map((item, index) => (
            <InputOTPSlot
              key={index}
              index={index}
              className="h-14 w-14 rounded-lg border-2 text-center"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>

      <Button
        size="lg"
        className="w-full"
        disabled={otp.length !== OTP_LENGTH}
        isLoading={verifyProps.isLoading || loginProps.isLoading}
        onClick={handleVerify}
        data-testid="verifyform-button"
      >
        Verify email
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="w-full gap-2"
        disabled={countdown.isCounting}
        isLoading={resendProps.isLoading}
        onClick={handleResend}
        data-testid="verifyform-button-2"
      >
        <RefreshCw className="size-4" />
        {countdown.isCounting
          ? `Resend code in ${countdown.seconds}s`
          : "Resend code"}
      </Button>
    </div>
  );
}
