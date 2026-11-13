import { Suspense } from "react";
import { NextPage } from "next";
import OffboardSummary from "@/container/Dashboard/Employees/OffboardSummary";

const page: NextPage = () => (
  <Suspense>
    <OffboardSummary />
  </Suspense>
);

export default page;
