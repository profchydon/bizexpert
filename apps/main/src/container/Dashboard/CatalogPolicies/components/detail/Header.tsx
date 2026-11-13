"use client";

import {
  Archive,
  ChevronDown,
  Edit,
  GitBranch,
  Package,
  SlidersHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useListReturnHref } from "@/hooks/useTablePageQuery";
import routes from "@/routes";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";

import type { CatalogRule } from "../../types";
import {
  canConfigureSelectionLimits,
  shouldShowActivatePolicyAction,
} from "../../utils";
import { RuleStatusBadge } from "../rules/RuleLists";

export function RuleDetailHeader({
  rule,
  canActivate = true,
  onEditRule,
  onEditKitConfig,
  onConfigureSelectionLimits,
  onConfigure,
  onActivate,
  onArchive,
  onDelete,
  isActivating = false,
}: {
  rule: CatalogRule;
  canActivate?: boolean;
  isActivating?: boolean;
  onEditRule: () => void;
  onEditKitConfig: () => void;
  onConfigureSelectionLimits: () => void;
  onConfigure: () => void;
  onActivate: () => void;
  onArchive: () => void;
  onDelete: () => void;
}) {
  const policiesHref = useListReturnHref(routes.CATALOG_POLICIES);
  const showSelectionLimits = canConfigureSelectionLimits(rule);
  const showActivatePolicy = shouldShowActivatePolicyAction(rule);

  const titleNode = (
    <div className="flex items-center gap-3">
      {rule.name}
      <RuleStatusBadge status={rule.status} />
      <Badge variant="gray" title="Specificity score">
        {rule.specificityScore}
      </Badge>
    </div>
  );

  return (
    <PageHeader
      pageTitle={titleNode}
      pageDescription=""
      breadCrumbs={[
        <Link key="catalog-policies" href={policiesHref}>
          Catalog Policy
        </Link>,
        rule.name,
      ]}
    >
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-10 gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-gray-700"
              data-testid="header-button"
            >
              Edit actions
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-56 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg"
          >
            <ActionItem
              icon={Edit}
              label="Edit catalog policy"
              onClick={onEditRule}
            />
            <ActionItem
              icon={Package}
              label="Edit kit configuration"
              onClick={onEditKitConfig}
            />
            {showSelectionLimits ? (
              <ActionItem
                icon={SlidersHorizontal}
                label="Configure selection limits"
                onClick={onConfigureSelectionLimits}
              />
            ) : null}
            <ActionItem
              icon={GitBranch}
              label="Add/Edit sub policy"
              onClick={onConfigure}
            />
            <DropdownMenuSeparator className="-mx-1.5 my-1 bg-gray-200" />
            <ActionItem
              icon={Archive}
              label={rule.status === "ARCHIVED" ? "Unarchive" : "Archive"}
              onClick={onArchive}
            />
            <ActionItem
              icon={Trash2}
              label="Delete"
              onClick={onDelete}
              tone="danger"
            />
          </DropdownMenuContent>
        </DropdownMenu>
        {showActivatePolicy ? (
          <Button
            disabled={isActivating}
            title={
              canActivate
                ? undefined
                : "Configure a sub policy for each kit before activating."
            }
            className="h-10 rounded-lg px-4 text-sm font-semibold"
            onClick={onActivate}
            data-testid="header-button-2"
          >
            {isActivating ? "Activating..." : "Activate Policy"}
          </Button>
        ) : null}
      </div>
    </PageHeader>
  );
}

function ActionItem({
  icon: Icon,
  label,
  onClick,
  tone = "default",
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  tone?: "default" | "danger";
}) {
  return (
    <DropdownMenuItem
      onClick={onClick}
      className="group block cursor-pointer rounded-none px-0 py-0 outline-none focus:bg-transparent"
    >
      <div
        className={`flex w-full items-center rounded-lg px-2.5 py-2 text-sm font-medium transition group-focus:bg-gray-50 group-data-[highlighted]:bg-gray-50 ${
          tone === "danger" ? "text-error-700" : "text-gray-700"
        }`}
      >
        <Icon
          className={`mr-2 size-4 shrink-0 ${
            tone === "danger" ? "text-error-500" : "text-gray-400"
          }`}
          strokeWidth={2.25}
        />
        <span className="truncate">{label}</span>
      </div>
    </DropdownMenuItem>
  );
}
