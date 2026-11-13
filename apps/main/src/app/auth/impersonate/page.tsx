import Impersonate from "@/container/Auth/Impersonate";
import { Suspense } from "react";

const ImpersonatePage = () => {
  return (
    <Suspense>
      <Impersonate />
    </Suspense>
  );
};

export default ImpersonatePage;
