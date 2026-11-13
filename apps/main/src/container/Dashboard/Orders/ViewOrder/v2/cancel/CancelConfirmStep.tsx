"use client";

import type { ReactNode } from "react";
import { SlashCircle01 } from "@untitledui/icons";
import { RefundSummaryRows } from "@/components/application/refund/refund-summary";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import type { RefundPreview } from "@/utils/refund-preview";
import { BlockLabel } from "./BlockLabel";
import { CancelScopeBlock } from "./CancelScopeBlock";
import { RefundPolicyBlock } from "./RefundPolicyBlock";
import { WorkStartedNotice } from "./WorkStartedNotice";
import type { CancelScope } from "./buildCancelScope";

interface Props {
  title: string;
  isPreAccept: boolean;
  prefix: string;
  preview: RefundPreview;
  canSubmit: boolean;
  scope: CancelScope;
  isOffboarding?: boolean;
  hasBox?: boolean;
  lineSelection?: {
    state: "all" | "some" | "none";
    onToggleLine: (lineId: string, selected: boolean) => void;
    onToggleAll: (selected: boolean) => void;
  };
  reason: ReactNode;
  backLabel: string;
  onBack: () => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function CancelConfirmStep(props: Props) {
  const {
    title,
    isPreAccept,
    prefix,
    preview,
    canSubmit,
    scope,
    isOffboarding,
    hasBox,
    lineSelection,
    reason,
    backLabel,
    onBack,
    onSubmit,
    onClose,
  } = props;

  return (
    <div className="flex max-h-[85vh] w-full flex-col rounded-2xl bg-primary shadow-xl">
      <div className="shrink-0 px-6 pt-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <FeaturedIcon
            icon={SlashCircle01}
            size="md"
            color="error"
            theme="light"
          />
          <CloseButton size="sm" onPress={onClose} />
        </div>
        <h3 className="mt-4 text-md font-semibold text-primary">{title}</h3>
        <p className="mt-1 text-sm text-tertiary">
          {isPreAccept
            ? "Order not started, so this cancels the order immediately."
            : "A vendor is already working on this, so a Rayda admin reviews the request within 24 hours."}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto border-t border-secondary px-6 py-4">
        <BlockLabel>You are cancelling</BlockLabel>
        <div className="mt-2.5">
          <CancelScopeBlock
            scope={scope}
            prefix={prefix}
            isOffboarding={isOffboarding}
            lineSelection={lineSelection}
          />
        </div>
        <div className="mt-4">{reason}</div>
        <div className="mt-5">
          <BlockLabel>Refund</BlockLabel>
        </div>
        <RefundSummaryRows preview={preview} className="mt-2.5" />
        {!isPreAccept && <WorkStartedNotice />}
        {isOffboarding && (
          <div className="mt-3">
            <RefundPolicyBlock hasBox={!!hasBox} />
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center justify-between gap-4 border-t border-secondary px-6 py-4">
        <span className="flex min-w-0 flex-col">
          <span className="text-xs font-medium text-tertiary">
            {preview.headlineLabel}
          </span>
          <span className="truncate text-lg font-semibold text-primary">
            {preview.headline}
          </span>
        </span>
        <span className="flex shrink-0 gap-3">
          <Button
            color="secondary"
            size="md"
            onClick={onBack}
            data-testid="cancelconfirmstep-button"
          >
            {backLabel}
          </Button>
          <Button
            color="primary"
            size="md"
            isDisabled={!canSubmit}
            onClick={onSubmit}
            data-testid="cancelconfirmstep-button-2"
          >
            Continue
          </Button>
        </span>
      </div>
    </div>
  );
}
