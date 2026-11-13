import { redirect } from "next/navigation";
import routes from "@/routes";

export default async function MarketDetailRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`${routes.INTEGRATIONS}/${slug}`);
}
