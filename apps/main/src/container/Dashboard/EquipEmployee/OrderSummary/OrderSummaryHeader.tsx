"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/PageHeader";

export default function OrderSummaryHeader({
  breadCrumbs,
  onBack,
}: {
  breadCrumbs: ReactNode[];
  onBack?: () => void;
}) {
  const router = useRouter();

  return (
    <PageHeader
      breadCrumbs={breadCrumbs}
      pageTitle="Order Summary"
      pageDescription="View all the details of your order and add ons that are popular with businesses like yours"
      onBack={() => {
        onBack?.();
        router.back();
      }}
    />
  );
}
