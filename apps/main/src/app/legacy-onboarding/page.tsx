import OnboardingContainer from "@/container/Onboarding";
import { Suspense } from "react";

const OnboardingPage = () => {
  return (
    <Suspense>
      <OnboardingContainer />
    </Suspense>
  );
};

export default OnboardingPage;
