"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import { useListReturnHref } from "@/hooks/useTablePageQuery";
import routes from "@/routes";
import Link from "next/link";

export function PageFrame({ children }: { children: React.ReactNode }) {
  return <main className="flex w-full flex-col gap-6 py-8">{children}</main>;
}

export function PolicyPageHeader({ onAddRule }: { onAddRule: () => void }) {
  return (
    <PageHeader
      pageTitle="Catalog Policy"
      pageDescription="Define rules to automate device provisioning"
      breadCrumbs={["Catalog Policy"]}
    >
      <Button
        onClick={onAddRule}
        className="gap-2 text-sm"
        data-testid="layout-button"
      >
        <Plus className="h-4 w-4" />
        Add Policy
      </Button>
    </PageHeader>
  );
}

export function FormSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      {children}
    </section>
  );
}

export function NotFoundState() {
  const policiesHref = useListReturnHref(routes.CATALOG_POLICIES);

  return (
    <PageFrame>
      <div className="rounded-2xl border bg-white p-10 text-center">
        <h1 className="text-xl font-semibold text-gray-950">
          Policy rule not found
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          The rule may have been removed.
        </p>
        <Button asChild className="mt-5" data-testid="layout-button-2">
          <Link href={policiesHref}>Back to Catalog Policy</Link>
        </Button>
      </div>
    </PageFrame>
  );
}
