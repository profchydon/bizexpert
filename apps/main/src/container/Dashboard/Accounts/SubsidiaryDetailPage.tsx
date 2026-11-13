"use client";

import PageState from "@/components/PageState";
import { SubsidiaryDetailView } from "./components/SubsidiaryDetailView";
import { SubsidiaryNotFound } from "./components/SubsidiaryNotFound";
import { useEntityDetail } from "./hooks/useEntityDetail";
import { useEntityDetailCardSetupReturn } from "./hooks/useEntityDetailCardSetupReturn";

interface Props {
  subsidiaryId: string;
}

export function SubsidiaryDetailPage({ subsidiaryId }: Props) {
  const { isResumingCardCapture } =
    useEntityDetailCardSetupReturn(subsidiaryId);
  const { detail, isLoading, isError, isNotFound } =
    useEntityDetail(subsidiaryId);

  const isPageLoading = isResumingCardCapture || (isLoading && !detail);

  if (!isPageLoading && (isError || isNotFound || !detail)) {
    return <SubsidiaryNotFound />;
  }

  return (
    <PageState isLoading={isPageLoading} isError={false}>
      {detail ? <SubsidiaryDetailView detail={detail} /> : null}
    </PageState>
  );
}
