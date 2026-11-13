"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import routes from "@/routes";
import type { PlanTier } from "../../types";
import { PLAN_LABEL, nextPlan } from "../../utils/planMeta";
import { planOfficeLimit } from "../../utils/planLimits";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  planTier: PlanTier;
  parentName?: string;
}

export function OfficePlanModal({
  isOpen,
  onClose,
  planTier,
  parentName,
}: Props) {
  const { push, isPending } = useTransitionRouter();
  const next = nextPlan(planTier);
  if (!next) return null;

  const currentLimit = planOfficeLimit(planTier);
  const who = parentName ?? "This entity";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      data-testid="officeplanmodal-dialog"
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upgrade to add more offices</DialogTitle>
          <DialogDescription>
            {who} has reached your {PLAN_LABEL[planTier]} plan&apos;s limit of{" "}
            {currentLimit} office{currentLimit === 1 ? "" : "s"}. Physical and
            remote offices both count. Upgrade to {PLAN_LABEL[next]} to add
            more.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-testid="officeplanmodal-button"
          >
            Maybe later
          </Button>
          <Button
            isLoading={isPending}
            onClick={() => push(routes.SETTINGS_SUBSCRIPTION)}
            data-testid="officeplanmodal-button-2"
          >
            Upgrade to {PLAN_LABEL[next]}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
