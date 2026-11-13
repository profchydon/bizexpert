import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupFormSchema } from "./validation";
import { useLoginAuthorizationMutation } from "@/api/baseQueries/authFlowApi/loginAuthorization";
import { useSignupMutation } from "@/api/baseQueries/authFlowApi/signup";
import { useJoinRequestMutation } from "@/api/baseQueries/authFlowApi/joinRequest";
import { z } from "zod";
import { useAppDispatch } from "@/store";
import { setOnboardingData } from "@/store/slices/onboardingSlice";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { showApiError } from "@/utils/showApiError";
import ExistingDomainDialog from "./ExistingDomainDialog";
import RequestSentState from "./RequestSentState";
import SignupForm from "./SignupForm";
import { startSignupLogin } from "./signupLogin";

interface Props {
  onContinue: () => void;
}

type SignupFormValues = z.infer<typeof signupFormSchema>;

type ExistingCompanyResponseItem = {
  id?: string;
  name?: string;
  email?: string;
};

const Signup: React.FC<Props> = ({ onContinue }) => {
  const dispatch = useAppDispatch();
  const [signup, signupProps] = useSignupMutation();
  const [joinRequest, joinRequestProps] = useJoinRequestMutation();
  const [loginAuthorization, loginAuthorizationProps] =
    useLoginAuthorizationMutation();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    mode: "onChange",
  });
  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordFieldFocused, setIsPasswordFieldFocused] = useState(false);
  const [existingDomainState, setExistingDomainState] = useState<{
    companyId: string;
    companyName: string;
    domain: string;
  } | null>(null);
  const [requestSentCompanyName, setRequestSentCompanyName] = useState<
    string | null
  >(null);
  const [pendingSignupData, setPendingSignupData] =
    useState<SignupFormValues | null>(null);

  const getExistingDomainStateFromError = (
    errorPayload: { data?: ExistingCompanyResponseItem[]; message?: string },
    signupEmail: string,
  ) => {
    const companies = Array.isArray(errorPayload?.data)
      ? errorPayload.data
      : [];
    const existingCompany = companies[0];
    const message = `${errorPayload?.message ?? ""}`.toLowerCase();

    if (
      !existingCompany?.id ||
      (!message.includes("already exists") && !message.includes("domain"))
    ) {
      return null;
    }

    const fallbackDomain = signupEmail?.split("@")[1]?.toLowerCase() || "";
    const responseDomain =
      existingCompany?.email?.split("@")[1]?.toLowerCase() || "";

    return {
      companyId: existingCompany.id,
      companyName: existingCompany?.name || "Existing company",
      domain: responseDomain || fallbackDomain,
    };
  };

  const submitInitialSignup = async (data: SignupFormValues | null) => {
    if (!data) return;

    try {
      const res = await signup({
        user: data,
        company: { email: data.email, phone: data.phone },
      }).unwrap();

      dispatch(
        setOnboardingData({
          user: res?.data?.user,
          company: res?.data?.company,
        }),
      );
      setExistingDomainState(null);
      setRequestSentCompanyName(null);
      setPendingSignupData(null);
      displaySuccessMessage("Account created successfully");
      onContinue();
    } catch (error) {
      const errorPayload =
        (error as { data?: unknown; error?: { data?: unknown } })?.data ??
        (error as { error?: { data?: unknown } })?.error?.data;
      const existing = getExistingDomainStateFromError(
        (errorPayload ?? {}) as {
          data?: ExistingCompanyResponseItem[];
          message?: string;
        },
        data.email,
      );
      if (existing) {
        setExistingDomainState(existing);
        return;
      }
      showApiError(error);
    }
  };

  const handleRequestToJoin = async () => {
    if (!existingDomainState || !pendingSignupData) return;

    try {
      await joinRequest({
        companyId: existingDomainState.companyId,
        email: pendingSignupData.email,
        first_name: pendingSignupData.first_name,
        last_name: pendingSignupData.last_name,
      }).unwrap();
      setRequestSentCompanyName(existingDomainState.companyName);
      setExistingDomainState(null);
    } catch (error) {
      showApiError(error);
    }
  };

  return (
    <>
      <ExistingDomainDialog
        companyName={existingDomainState?.companyName || ""}
        domain={existingDomainState?.domain || ""}
        open={Boolean(existingDomainState)}
        isLoading={signupProps.isLoading || joinRequestProps.isLoading}
        onCreateNew={() => setExistingDomainState(null)}
        onOpenChange={(open) => {
          if (!open) setExistingDomainState(null);
        }}
        onRequestToJoin={handleRequestToJoin}
      />

      <RequestSentState
        companyName={requestSentCompanyName || ""}
        open={Boolean(requestSentCompanyName)}
        onOpenChange={(open) => {
          if (!open) setRequestSentCompanyName(null);
        }}
      />

      <SignupForm
        form={form}
        password={password}
        isPasswordValid={isPasswordValid}
        isPasswordFieldFocused={isPasswordFieldFocused}
        isSubmitting={signupProps.isLoading}
        isLoginLoading={loginAuthorizationProps.isLoading}
        onPasswordChange={setPassword}
        onPasswordFocus={() => setIsPasswordFieldFocused(true)}
        onPasswordValidChange={setIsPasswordValid}
        onLogin={() => void startSignupLogin(loginAuthorization)}
        onSubmit={(data) => {
          setRequestSentCompanyName(null);
          setExistingDomainState(null);
          setPendingSignupData(data);
          void submitInitialSignup(data);
        }}
      />
    </>
  );
};

export default Signup;
