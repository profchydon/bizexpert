import { Suspense } from "react";
import { NextPage } from "next";
import OnboardSummary from "@/container/Dashboard/Employees/OnboardSummary";

const page: NextPage = () => (
  <Suspense>
    <OnboardSummary />
  </Suspense>
);

export default page;
