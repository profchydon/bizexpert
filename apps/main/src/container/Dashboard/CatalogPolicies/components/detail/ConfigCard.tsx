"use client";

import Link from "next/link";
import { Package } from "lucide-react";

import routes from "@/routes";

import type { CatalogRule } from "../../types";
import { getRuleKits, getSelectionLimitLabels } from "../../utils";
import { formatApprovalType } from "../../utilsFormat";
import { ApproverRows } from "./ApproverRows";

export function RuleConfigCard({
  rule,
}: {
  rule: CatalogRule;
  childRules: CatalogRule[];
}) {
  const kits = getRuleKits(rule);
  const selectionLimits = getSelectionLimitLabels(rule);
  return (
    <div className="flex flex-col divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white p-6">
      <Section title="Configuration">
        <Info label="Purpose" value="Onboarding" badgeTone="blue" />
        <Info
          label="Selection Mode"
          value={rule.selectionMode === "OPEN" ? "Open" : "Fixed"}
          badgeTone="blue"
        />
        <Info label="Approval Type" value={formatApprovalType(rule)} />
        <Info
          label="Allow Item Swap"
          value={rule.allowItemSwap ? "Yes" : "No"}
        />
      </Section>
      <Section title="Match Criteria">
        <Info label="Roles" value={rule.matchRoles.join(", ") || "(All)"} />
        <Info label="Levels" value={rule.matchLevels.join(", ") || "(All)"} />
        <Info
          label="Departments"
          value={rule.matchDepartments.join(", ") || "(All)"}
        />
        <Info
          label="Countries"
          value={rule.matchCountries.join(", ") || "(Global)"}
        />
      </Section>
      {rule.requiresApproval ? (
        <Section title="Approvers">
          <ApproverRows approvers={rule.approvers} />
        </Section>
      ) : null}
      {/* {childRules.length ? (
        <Section title="Sub Rules">
          {childRules.map((child) => (
            <ChildRuleRow key={child.id} rule={child} />
          ))}
        </Section>
      ) : null} */}
      <Section title="Kits">
        {kits.map((kit) => (
          <PillRow
            key={kit.id}
            icon={<Package />}
            label={`${kit.name} · ${kit.itemsCount ?? kit.items.length} items`}
            href={routes.KIT_DETAIL(kit.id)}
          />
        ))}
      </Section>
      {selectionLimits.length ? (
        <Section title="Selection Limits">
          <div className="flex flex-wrap gap-x-2 gap-y-2">
            {selectionLimits.map((limit) => (
              <span
                key={limit}
                className="inline-flex items-center whitespace-nowrap rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-normal leading-4 text-gray-600 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
              >
                {limit}
              </span>
            ))}
          </div>
        </Section>
      ) : null}
      {rule.includeCompanyStorage ? (
        <Section title="Storage">
          <Info label="Include Storage" value="Yes" />
        </Section>
      ) : null}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2 py-6 first:pt-0 last:pb-0">
      <h2 className="mb-2 text-base font-semibold text-gray-900">{title}</h2>
      {children}
    </section>
  );
}

function Info({
  label,
  value,
  badgeTone,
}: {
  label: string;
  value: string;
  badgeTone?: "blue";
}) {
  return (
    <div className="flex flex-col gap-1.5 py-2">
      <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </span>
      {badgeTone ? (
        <span className="inline-flex w-fit items-center rounded-full border border-primary-200 bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
          {value}
        </span>
      ) : (
        <span className="text-sm font-medium leading-5 text-gray-900">
          {value}
        </span>
      )}
    </div>
  );
}

function PillRow({
  icon,
  label,
  href,
}: {
  icon: React.ReactElement;
  label: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-primary-600 [&>svg]:h-3.5 [&>svg]:w-3.5">
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-700">
        {label}
      </span>
      {href ? (
        <span className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700">
          View
        </span>
      ) : null}
    </>
  );

  const className =
    "flex w-full items-center gap-3 rounded-full border border-gray-200 bg-gray-50 py-1 pl-1 pr-1 transition hover:bg-gray-100";
  return href ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}
