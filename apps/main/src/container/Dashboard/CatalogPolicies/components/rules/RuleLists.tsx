"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTableListLocation } from "@/hooks/tableListLocation";
import { withListLocation } from "@/utils/tableListPage";
import routes from "@/routes";

import {
  CriteriaRow,
  RedConflictMessage,
  RuleCardActions,
  RuleStatusBadges,
} from "./RuleCardParts";
import type { CatalogRule, ConflictResult } from "../../types";
import { formatSpecificityTooltip } from "../../utils";

export { RuleStatusBadge } from "./RuleCardParts";

export function RuleCard({
  rule,
  conflicts,
  onArchive,
  onActivate,
  onConfigure,
  onDelete,
}: {
  rule: CatalogRule;
  conflicts: ConflictResult[];
  onArchive: (rule: CatalogRule) => void;
  onActivate: (rule: CatalogRule) => void;
  onConfigure: (rule: CatalogRule) => void;
  onDelete: (rule: CatalogRule) => void;
}) {
  const router = useRouter();
  const listLocation = useTableListLocation();
  const detailHref = withListLocation(
    routes.CATALOG_POLICY_DETAIL(rule.id),
    listLocation,
  );
  const redConflict = conflicts.find((conflict) => conflict.severity === "RED");
  return (
    <article
      className={cn(
        "flex h-full cursor-pointer flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 transition hover:shadow-sm",
        redConflict && "border-2 border-error-300",
      )}
      onClick={() => router.push(detailHref)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col items-start gap-2">
          <RuleStatusBadges rule={rule} />
          <h2 className="text-lg font-semibold text-gray-900">{rule.name}</h2>
        </div>
        <div onClick={(event) => event.stopPropagation()}>
          <RuleCardActions
            rule={rule}
            onArchive={onArchive}
            onConfigure={onConfigure}
            onDelete={onDelete}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <CriteriaRow
          label="Level"
          value={rule.matchLevels.join(", ") || "All levels"}
        />
        <CriteriaRow
          label="Dept"
          value={rule.matchDepartments.join(", ") || "All departments"}
        />
        <CriteriaRow
          label="Country"
          value={rule.matchCountries.join(", ") || "Global"}
        />
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-200 pt-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          Specificity:
          <Badge
            title={formatSpecificityTooltip(rule)}
            variant={redConflict ? "error" : "gray"}
          >
            {rule.specificityScore}
          </Badge>
        </div>
        <div
          className="flex items-center gap-2"
          onClick={(event) => event.stopPropagation()}
        >
          {rule.status === "DRAFT" ? (
            <Button
              size="sm"
              disabled={Boolean(redConflict)}
              onClick={() => onActivate(rule)}
              data-testid="rulelists-button"
            >
              Activate
            </Button>
          ) : null}
          <Button
            asChild
            size="sm"
            variant={rule.status === "DRAFT" ? "outline" : "primary"}
            className="h-10 rounded-lg px-4 text-sm font-semibold"
            data-testid="rulelists-button-2"
          >
            <Link href={detailHref}>
              View
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      {redConflict ? <RedConflictMessage conflict={redConflict} /> : null}
    </article>
  );
}

export function RuleLoadingSkeleton() {
  return <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />;
}
