import { Suspense } from "react";
import { SubsidiaryDetailPage } from "@/container/Dashboard/Accounts/SubsidiaryDetailPage";
import { SubsidiaryDetailPageFallback } from "@/container/Dashboard/Accounts/components/SubsidiaryDetailPageFallback";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<SubsidiaryDetailPageFallback />}>
      <SubsidiaryDetailPage subsidiaryId={id} />
    </Suspense>
  );
}
