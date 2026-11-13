import { Suspense } from "react";
import AccountsPage from "@/container/Dashboard/Accounts/AccountsPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AccountsPage />
    </Suspense>
  );
}
