import { redirect } from "next/navigation";
import { isBizExpertApp } from "@/config/product";
import routes from "@/routes";

export default function Home() {
  if (isBizExpertApp()) {
    redirect(routes.LOGIN);
  }
  redirect(routes.ONBOARDING);
}
