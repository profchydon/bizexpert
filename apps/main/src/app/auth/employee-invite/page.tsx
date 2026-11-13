import EmployeeInvite from "@/container/Auth/EmployeeInvite";
import { Suspense } from "react";

const Page = () => {
  return (
    <Suspense>
      <EmployeeInvite />
    </Suspense>
  );
};

export default Page;
