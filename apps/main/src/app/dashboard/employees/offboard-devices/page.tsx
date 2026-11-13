import { Suspense } from "react";
import { NextPage } from "next";
import OffboardDevices from "@/container/Dashboard/Employees/OffboardDevices";

const page: NextPage = () => (
  <Suspense>
    <OffboardDevices />
  </Suspense>
);

export default page;
