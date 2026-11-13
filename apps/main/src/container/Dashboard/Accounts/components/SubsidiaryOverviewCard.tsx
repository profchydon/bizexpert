import type { ReactNode } from "react";
import { Badge } from "@/components/base/badges/badges";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { PlanTier, Subsidiary } from "../types";
import {
  CURRENCY_TOOLTIP,
  creditColor,
  creditLabel,
  creditTooltip,
} from "../utils/badgeTooltips";
import { formatCreatedDate } from "../utils/formatCreatedDate";
import { planSupportsCredit } from "../utils/planCredit";
import {
  detailCardBodyClass,
  detailCardClass,
  detailCardTitleClass,
  detailRowClass,
  detailRowLabelClass,
  detailRowValueClass,
} from "./detailCardClasses";
import { SubsidiaryStatusBadge } from "./SubsidiaryStatusBadge";

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className={detailRowClass}>
      <span className={detailRowLabelClass}>{label}</span>
      <span className={detailRowValueClass}>{value}</span>
    </div>
  );
}

export function SubsidiaryOverviewCard({
  subsidiary,
  planTier,
  pendingInvitation = false,
}: {
  subsidiary: Subsidiary;
  planTier: PlanTier;
  pendingInvitation?: boolean;
}) {
  const cardOnlyPlan = !planSupportsCredit(planTier);

  return (
    <section className={detailCardClass}>
      <h2 className={detailCardTitleClass}>Billing entity</h2>
      <div className={detailCardBodyClass}>
        <Row
          label="Status"
          value={<SubsidiaryStatusBadge status={subsidiary.status} />}
        />
        <Row
          label="Currency"
          value={
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-default">
                    <Badge color="gray" size="sm" type="pill-color">
                      {subsidiary.currency}
                    </Badge>
                  </span>
                </TooltipTrigger>
                <TooltipContent>{CURRENCY_TOOLTIP}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          }
        />
        <Row
          label="Card on file"
          value={subsidiary.cardOnFile ? "Yes" : "Not captured"}
        />
        <Row
          label="Credit"
          value={
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-default">
                    <Badge
                      color={creditColor[subsidiary.creditState]}
                      size="sm"
                      type="pill-color"
                    >
                      {creditLabel[subsidiary.creditState]}
                    </Badge>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {creditTooltip[subsidiary.creditState]}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          }
        />
        {cardOnlyPlan && (
          <p className="py-2 text-xs text-gray-600">
            Net-30 credit isn&apos;t available on Procure. Charges go to the
            card on file.
          </p>
        )}
        <Row label="Credit clock" value="—" />
        <Row
          label="Admins"
          value={
            subsidiary.admins.length > 0 ? (
              <span className="flex flex-wrap justify-end gap-1.5">
                {subsidiary.admins.map((name) => (
                  <span
                    key={name}
                    className="rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700"
                  >
                    {name}
                  </span>
                ))}
              </span>
            ) : pendingInvitation ? (
              <Badge color="warning" size="sm" type="pill-color">
                Pending invitation
              </Badge>
            ) : (
              "—"
            )
          }
        />
        <Row
          label="Created"
          value={formatCreatedDate(subsidiary.createdDaysAgo)}
        />
        <Row label="Created by" value={subsidiary.createdBy} />
      </div>
    </section>
  );
}
