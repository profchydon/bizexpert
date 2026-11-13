"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useListReturnHref } from "@/hooks/useTablePageQuery";
import routes from "@/routes";

export function SubsidiaryNotFound() {
  const accountsHref = useListReturnHref(routes.ACCOUNTS);

  return (
    <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
      <h1 className="text-lg font-semibold text-gray-900">Entity not found</h1>
      <p className="mt-2 text-sm text-gray-600">
        This entity may have been removed or is unavailable.
      </p>
      <Button asChild className="mt-4" data-testid="subsidiarynotfound-button">
        <Link href={accountsHref}>Back to Account management</Link>
      </Button>
    </div>
  );
}
