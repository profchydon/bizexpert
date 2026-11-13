import { redirect } from "next/navigation";
import routes from "@/routes";
import { OfficeDetailPage } from "@/container/Dashboard/Accounts/Offices/OfficeDetailPage";
import {
  isOfficeDetailFromSubsidiary,
  officeDetailHref,
  resolveOfficeDetailEntityId,
} from "@/container/Dashboard/Accounts/Offices/utils/officeDetailHref";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ officeId: string }>;
  searchParams: Promise<{
    entityId?: string;
    entity?: string;
    from?: string;
  }>;
}) {
  const { officeId } = await params;
  const search = await searchParams;
  const { entityId, rewriteLegacy } = resolveOfficeDetailEntityId(search);
  const fromSubsidiary = isOfficeDetailFromSubsidiary(search.from);

  if (!entityId) redirect(`${routes.ACCOUNTS}?tab=offices`);

  if (rewriteLegacy) {
    redirect(
      officeDetailHref(
        { id: officeId, subsidiaryId: entityId },
        { fromSubsidiary },
      ),
    );
  }

  return (
    <OfficeDetailPage
      officeId={officeId}
      entityId={entityId}
      fromSubsidiary={fromSubsidiary}
    />
  );
}
