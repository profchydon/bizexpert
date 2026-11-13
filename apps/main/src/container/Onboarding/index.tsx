"use client";

import React, { FC, useEffect } from "react";
import CompanyInformation from "./CompanyInformation";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import createQueryString from "@/utils/createQueryString";
import onboardingSectionBanner from "@/assets/images/Section.svg";
import Image from "next/image";
import Signup from "./Signup";
import VerifyContainer from "./Verify";
import CompanyProfile from "./CompanyProfile";
import routes from "@/routes";
import { useAppDispatch, useAppSelector } from "@/store";
import { resetOnboardingData } from "@/store/slices/onboardingSlice";
import { useLoginAuthorizationMutation } from "@/api/baseQueries/authFlowApi/loginAuthorization";
import { unsetAuth } from "@/store/slices/authSlice";
import { assignSafeRedirectUrl } from "@/utils/auth/isSafeRedirectUrl";
import displayErrorMessage from "@/utils/displayErrorMessage";
import { showApiError } from "@/utils/showApiError";
import { useAuthUserDetail } from "@/utils/useAuthUser";

export enum Stages {
  // Pricing = "pricing",
  Signup = "signup",
  Verify = "verify",
  CompanyProfile = "company-profile",
  CompanyInformation = "company-information",
}

const OnboardingContainer: FC = () => {
  const { getUserDetails, isLoggedIn } = useAuthUserDetail();
  const loggedIn = isLoggedIn();
  const user = getUserDetails();

  const dispatch = useAppDispatch();
  const onboardingDetails = useAppSelector(
    (state) => state.persistedReducers.onboarding,
  );
  const userDetail = onboardingDetails?.user;

  const router = useRouter();
  const param = useSearchParams();
  const pathname = usePathname();
  const onboardingStage = param.get("stage");

  const [loginAuthorization] = useLoginAuthorizationMutation();

  const updateStageParam = (stage: string) =>
    router.push(`${pathname}?${createQueryString("stage", stage)}`);

  const updateStage = () => {
    if (userDetail) {
      if (userDetail.stage === "Verification") {
        updateStageParam(Stages.Verify);
      } else if (userDetail.stage === "Company Details") {
        updateStageParam(Stages.CompanyProfile);
      } else if (userDetail.stage === "Company Information") {
        updateStageParam(Stages.CompanyInformation);
      }
    } else {
      if (onboardingStage !== Stages.CompanyInformation) {
        updateStageParam(Stages.Signup);
        dispatch(resetOnboardingData());
      }
    }
  };

  useEffect(() => {
    if (!onboardingStage) {
      router.push(`${pathname}?${createQueryString("stage", Stages.Signup)}`);
    }
  }, [onboardingStage, pathname]);

  useEffect(() => {
    updateStage();
  }, [userDetail]);

  useEffect(() => {
    if (
      onboardingStage === Stages.Verify &&
      userDetail?.stage !== "Verification"
    ) {
      updateStage();
    }
  }, [userDetail, onboardingStage]);

  useEffect(() => {
    if (
      loggedIn &&
      user?.stage === "Completed" &&
      onboardingStage === Stages.Signup
    ) {
      router.push(routes.DASHBOARD);
    }
  }, [loggedIn, user, onboardingStage]);

  return (
    <div className="relative h-screen w-full">
      <div className="lg:w-1/2">
        {onboardingStage === Stages.Signup && (
          <Signup
            onContinue={() =>
              router.push(`${pathname}?${createQueryString("stage", "verify")}`)
            }
          />
        )}

        {onboardingStage === Stages.CompanyProfile && (
          <CompanyProfile
            onContinue={() =>
              router.push(
                `${pathname}?${createQueryString("stage", "company-information")}`,
              )
            }
          />
        )}

        {onboardingStage === Stages.CompanyInformation && (
          <CompanyInformation
            onContinue={async () => {
              try {
                const session = await loginAuthorization().unwrap();
                if (!assignSafeRedirectUrl(session.data.redirect_url)) {
                  displayErrorMessage(
                    "We couldn't continue.",
                    "The sign-in address from the server was not a valid http or https URL.",
                  );
                  return;
                }
                dispatch(resetOnboardingData());
                dispatch(unsetAuth());
              } catch (error) {
                showApiError(error);
              }
            }}
          />
        )}
      </div>

      {onboardingStage === Stages.Verify && (
        <VerifyContainer
          onContinue={() =>
            router.push(
              `${pathname}?${createQueryString("stage", "company-profile")}`,
            )
          }
        />
      )}

      {onboardingStage && onboardingStage !== Stages.Verify && (
        <div className="h-screen lg:fixed lg:top-0 lg:w-1/2 lg:right-0 hidden lg:block">
          <Image
            src={onboardingSectionBanner}
            alt="onboarding-banner"
            className="w-full object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default OnboardingContainer;
