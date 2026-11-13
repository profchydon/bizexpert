import Callback from "@/container/Auth/Callback";
import { Suspense } from "react";

const AuthCallbackPage = () => {
  return (
    <Suspense>
      <Callback />
    </Suspense>
  );
};

export default AuthCallbackPage;
