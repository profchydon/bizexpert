import { Suspense } from "react";
import { NextPage } from "next";
import OnboardDevices from "@/container/Dashboard/Employees/OnboardDevices";

const page: NextPage = () => (
  <Suspense>
    <OnboardDevices />
  </Suspense>
);

export default page;
