"use client";

import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import routes from "@/routes";

import type { CatalogRule } from "../../types";
import { summarizeCriteria } from "../../utils";

export function RuleFormHeader({
  rule,
  isEdit,
  ruleId,
  onSave,
  saveDisabled,
}: {
  rule: CatalogRule;
  isEdit: boolean;
  ruleId?: string;
  onSave: () => void;
  saveDisabled: boolean;
}) {
  const backHref =
    isEdit && ruleId
      ? routes.CATALOG_POLICY_DETAIL(ruleId)
      : routes.CATALOG_POLICIES;
  return (
    <header className="sticky top-[72px] z-40 border-b bg-white/95 px-4 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-[920px] items-center justify-between gap-3">
        <Button asChild variant="ghost" data-testid="drawers-button">
          <Link href={backHref}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-gray-950">
            {isEdit ? `Edit ${rule.name}` : "New Catalog Policy"}
          </p>
          <p className="truncate text-xs text-gray-500">
            {summarizeCriteria(rule)}
          </p>
        </div>
        <Button
          disabled={saveDisabled}
          onClick={onSave}
          data-testid="drawers-button-2"
        >
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>
    </header>
  );
}
