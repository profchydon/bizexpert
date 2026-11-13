import { Suspense } from "react";
import OffboardingOrderSummaryContainer from "@/container/Offboarding/OffboardingOrderSummary";
import { NextPage } from "next";

const page: NextPage = () => {
  return (
    <Suspense>
      <OffboardingOrderSummaryContainer />
    </Suspense>
  );
};

export default page;
