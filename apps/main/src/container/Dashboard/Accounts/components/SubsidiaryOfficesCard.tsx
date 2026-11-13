"use client";

import { useState } from "react";
import { Building2, Package } from "lucide-react";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FeaturedIcon } from "@/components/FeaturedIcon";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import routes from "@/routes";
import type { Office, PlanTier, Subsidiary } from "../types";
import { OfficeClosedBadge } from "../Offices/components/OfficeClosedBadge";
import { officeDetailHref } from "../Offices/utils/officeDetailHref";
import { toOfficeParent } from "../Offices/utils/buildOffice";
import { planOfficeLimit } from "../utils/planLimits";
import { detailCardLinkClass } from "./detailCardClasses";
import { OfficeCreateLauncher } from "../Offices/components/OfficeCreateLauncher";

const PREVIEW_COUNT = 5;

export function SubsidiaryOfficesCard({
  subsidiary,
  planTier,
  offices,
}: {
  subsidiary: Subsidiary;
  planTier: PlanTier;
  offices: Office[];
}) {
  const [activeOfficeId, setActiveOfficeId] = useState<string | null>(null);
  const { push, isPending } = useTransitionRouter();
  const preview = offices.slice(0, PREVIEW_COUNT);
  const limit = planOfficeLimit(planTier);
  const atLimit = subsidiary.officesCount >= limit;
  const allOfficesHref = `${routes.ACCOUNTS}?tab=offices&subsidiary=${subsidiary.id}`;
  const canAddOffice = subsidiary.status !== "closed";

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-xslg">
      <div className="flex items-center justify-between gap-2 px-5 py-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-gray-900">Offices</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-default">
                  <Badge color="brand" size="sm" type="pill-color">
                    {subsidiary.officesCount} Office(s)
                  </Badge>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                Offices operating under this entity.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {canAddOffice && (
          <OfficeCreateLauncher
            parentOptions={[toOfficeParent(subsidiary)]}
            fixedParentId={subsidiary.id}
            label="Add office"
            size="sm"
          />
        )}
      </div>
      <div className="border-t border-gray-200" />
      <div className="p-5">
        {offices.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <FeaturedIcon icon={Package} size="md" color="gray" theme="light" />
            <div>
              <p className="text-sm font-semibold text-gray-900">No offices</p>
              <p className="mt-1 text-sm text-gray-600">
                This entity has no offices under it yet.
              </p>
            </div>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {preview.map((office) => (
              <li
                key={office.id}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
              >
                <FeaturedIcon
                  icon={Building2}
                  size="sm"
                  color="gray"
                  theme="modern"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {office.name}
                    </p>
                    {office.status === "closed" && <OfficeClosedBadge />}
                  </div>
                  <p className="text-xs text-gray-600">{office.type}</p>
                </div>
                <Button
                  variant="link"
                  className="h-auto shrink-0 px-0 text-sm font-semibold text-primary-700"
                  isLoading={isPending && activeOfficeId === office.id}
                  onClick={() => {
                    setActiveOfficeId(office.id);
                    push(
                      officeDetailHref(
                        {
                          id: office.id,
                          subsidiaryId: office.subsidiaryId || subsidiary.id,
                        },
                        { fromSubsidiary: true },
                      ),
                    );
                  }}
                  data-testid="subsidiaryofficescard-button"
                >
                  View
                </Button>
              </li>
            ))}
          </ul>
        )}
        {offices.length > PREVIEW_COUNT && (
          <button
            type="button"
            className={detailCardLinkClass}
            onClick={() => push(allOfficesHref)}
          >
            View all {offices.length} offices
          </button>
        )}
        {Number.isFinite(limit) && (
          <p className="mt-4 text-xs text-gray-600">
            Your plan includes up to {limit} office{limit === 1 ? "" : "s"}.
            {atLimit ? " Upgrade your plan to add more." : ""}
          </p>
        )}
      </div>
    </section>
  );
}
