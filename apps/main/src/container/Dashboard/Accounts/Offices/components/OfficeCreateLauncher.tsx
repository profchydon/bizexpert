"use client";

import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useAccountsPlanTier,
  useActingAdmin,
} from "../../hooks/useAccountsData";
import type { OfficeParent } from "../../types";
import { canCreateOffices } from "../../utils/adminScope";
import { planOfficeLimit } from "../../utils/planLimits";
import {
  accountsToolbarIconClass,
  accountsToolbarPrimaryButtonClass,
} from "../../components/accountsTableToolbarClasses";
import { AccountsFloatingAlert } from "../../components/AccountsFloatingAlert";
import { CreateOfficeWizard } from "../wizard/CreateOfficeWizard";
import { OfficePlanModal } from "./OfficePlanModal";

interface Props {
  parentOptions: OfficeParent[];
  fixedParentId?: string;
  label?: string;
  size?: "sm" | "md";
  hasMoreParents?: boolean;
  isLoadingMoreParents?: boolean;
  onLoadMoreParents?: () => void;
  parentSearch?: string;
  onParentSearchChange?: (value: string) => void;
}

export function OfficeCreateLauncher({
  parentOptions,
  fixedParentId,
  label = "Create office",
  size = "md",
  hasMoreParents,
  isLoadingMoreParents,
  onLoadMoreParents,
  parentSearch,
  onParentSearchChange,
}: Props) {
  const planTier = useAccountsPlanTier();
  const acting = useActingAdmin();
  const [open, setOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [alert, setAlert] = useState<{ name: string } | null>(null);
  const pending = useRef<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => setAlert(null), 6000);
    return () => clearTimeout(timer);
  }, [alert]);

  if (!canCreateOffices(acting)) return null;

  const limit = planOfficeLimit(planTier);
  const eligible = fixedParentId
    ? parentOptions.filter((parent) => parent.id === fixedParentId)
    : parentOptions;
  const blocked =
    eligible.length > 0 &&
    eligible.every((parent) => parent.officesCount >= limit);
  const blockedName =
    blocked && eligible.length === 1 ? eligible[0]?.name : undefined;

  function handleClose() {
    setOpen(false);
    if (pending.current) {
      setAlert(pending.current);
      pending.current = null;
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="primary"
        size={size}
        className={
          size === "sm" ? accountsToolbarPrimaryButtonClass : undefined
        }
        onClick={() => (blocked ? setPlanOpen(true) : setOpen(true))}
        data-testid="officecreatelauncher-button"
      >
        <Plus
          className={size === "sm" ? accountsToolbarIconClass : "mr-2 size-4"}
        />
        {label}
      </Button>
      <CreateOfficeWizard
        isOpen={open}
        onClose={handleClose}
        parentOptions={parentOptions}
        fixedParentId={fixedParentId}
        onCreated={(summary) => {
          pending.current = summary;
        }}
        hasMoreParents={hasMoreParents}
        isLoadingMoreParents={isLoadingMoreParents}
        onLoadMoreParents={onLoadMoreParents}
        parentSearch={parentSearch}
        onParentSearchChange={onParentSearchChange}
      />
      <OfficePlanModal
        isOpen={planOpen}
        onClose={() => setPlanOpen(false)}
        planTier={planTier}
        parentName={blockedName}
      />
      <AccountsFloatingAlert
        show={Boolean(alert)}
        title="Office created"
        description={
          alert
            ? `${alert.name} is active and now appears under its parent entity.`
            : undefined
        }
        onDismiss={() => setAlert(null)}
      />
    </>
  );
}
