import { redirect } from "next/navigation";
import { isBizExpertApp } from "@/config/product";
import routes from "@/routes";
import NewOnboardingSignup from "@/container/NewOnboarding/Signup";

export default function Page() {
  if (isBizExpertApp()) {
    redirect(routes.LOGIN);
  }
  return <NewOnboardingSignup />;
}
