"use client";

import Link from "next/link";
import { Badge } from "@/components/base/badges/badges";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import routes from "@/routes";
import { regionCountryCode } from "../../../data/regionCountryCodes";
import type { Office } from "../../../types";
import { formatCreatedDate } from "../../../utils/formatCreatedDate";
import { WizardRegionFlag } from "../../../components/wizard/WizardRegionFlag";
import { OfficeAdminList } from "./OfficeAdminList";
import {
  detailCardBodyClass,
  detailCardClass,
  detailCardTitleClass,
  detailRowClass,
  detailRowLabelClass,
  detailRowValueClass,
} from "../../../components/detailCardClasses";

const STATUS: Record<
  Office["status"],
  {
    label: string;
    color: "success" | "warning" | "gray";
    tip: string;
  }
> = {
  active: {
    label: "Active",
    color: "success",
    tip: "This office is operational. Assets and employees can be assigned.",
  },
  shutting_down: {
    label: "Shutting down",
    color: "warning",
    tip: "This office is being wound down. Its assets and people are being reassigned.",
  },
  closed: {
    label: "Closed",
    color: "gray",
    tip: "This office has been closed. It stays visible for your records.",
  },
};

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={detailRowClass}>
      <span className={detailRowLabelClass}>{label}</span>
      <span className={detailRowValueClass}>{children}</span>
    </div>
  );
}

export function OfficeOverviewCard({ office }: { office: Office }) {
  const status = STATUS[office.status];
  const isPhysical = office.type === "Physical";
  const countryCode = regionCountryCode[office.region];
  const officeAdminRefs =
    office.officeAdminRefs ?? office.officeAdmins.map((name) => ({ name }));

  return (
    <section className={detailCardClass}>
      <h2 className={detailCardTitleClass}>Office details</h2>
      <div className={detailCardBodyClass}>
        <Row label="Type">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-default">
                  <Badge color={isPhysical ? "blue" : "gray"} size="sm">
                    {office.type}
                  </Badge>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {isPhysical
                  ? "A physical location with an address."
                  : "A distributed, remote workforce with no physical address."}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Row>
        <Row label="Status">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-default">
                  <Badge color={status.color} size="sm">
                    {status.label}
                  </Badge>
                </span>
              </TooltipTrigger>
              <TooltipContent>{status.tip}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Row>
        <Row label="Country">
          <span className="inline-flex items-center gap-2">
            {countryCode && <WizardRegionFlag code={countryCode} />}
            {office.region}
          </span>
        </Row>
        <Row label="Address">
          {isPhysical ? (
            (office.address ?? "Not set")
          ) : (
            <span className="text-gray-500">
              Remote office. No physical address.
            </span>
          )}
        </Row>
        <Row label="Billing currency">
          <div>
            {office.currency}
            <p className="text-xs font-normal text-gray-500">
              Inherited from {office.subsidiaryName}
            </p>
          </div>
        </Row>
        <Row label="Entity">
          <Link
            href={routes.SUBSIDIARY_DETAIL(office.subsidiaryId)}
            className="font-semibold text-primary-700 hover:underline"
          >
            {office.subsidiaryName}
          </Link>
        </Row>
        <Row label="Office admins">
          <OfficeAdminList admins={officeAdminRefs} />
        </Row>
        <Row label="Created">
          {formatCreatedDate(office.createdDaysAgo ?? 0)}
        </Row>
        <Row label="Created by">{office.createdBy ?? "—"}</Row>
      </div>
    </section>
  );
}
