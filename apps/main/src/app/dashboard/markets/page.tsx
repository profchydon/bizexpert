import { redirect } from "next/navigation";
import routes from "@/routes";

export default function MarketsRedirectPage() {
  redirect(routes.INTEGRATIONS);
}
