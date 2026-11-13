"use client";

import { useState } from "react";
import { Clock, SlashCircle01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import {
  TypeToConfirm,
  confirmMatches,
} from "@/components/base/input/type-to-confirm";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { cx } from "@/utils/cx";
import type { RefundPreview } from "@/utils/refund-preview";
import type { CancelConsequence } from "./buildCancelConsequence";

interface Props {
  consequence: CancelConsequence;
  preview: RefundPreview;
  isPreAccept: boolean;
  orderId: string;
  confirmLabel: string;
  requiresTypeToConfirm: boolean;
  onBack: () => void;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
  isSubmitting?: boolean;
}

export function CancelCommitStep({
  consequence,
  preview,
  isPreAccept,
  orderId,
  confirmLabel,
  requiresTypeToConfirm,
  onBack,
  onConfirm,
  onClose,
  isSubmitting = false,
}: Props) {
  const [typed, setTyped] = useState("");
  const armed =
    !isPreAccept || !requiresTypeToConfirm || confirmMatches(typed, orderId);

  return (
    <div className="flex max-h-[85vh] w-full flex-col rounded-2xl bg-primary shadow-xl">
      <div className="shrink-0 px-6 pt-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <FeaturedIcon
            icon={isPreAccept ? SlashCircle01 : Clock}
            size="md"
            color={isPreAccept ? "error" : "brand"}
            theme="light"
          />
          <CloseButton size="sm" onPress={onClose} />
        </div>
        <h3 className="mt-4 text-md font-semibold text-primary">
          {isPreAccept
            ? "Confirm this cancellation"
            : "Send this cancellation request"}
        </h3>
        <p className="mt-1 text-sm text-tertiary">
          {isPreAccept
            ? "This is the last step. There is no undo after it."
            : "A Rayda admin decides. You can withdraw it until they do."}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto border-t border-secondary px-6 py-4">
        <div
          className={cx(
            "flex flex-col gap-2 rounded-xl border border-l-2 border-secondary p-4",
            isPreAccept ? "border-l-error" : "border-l-brand",
          )}
        >
          <p className="text-sm font-medium text-primary">
            {consequence.headline}
          </p>
          <ul className="flex flex-col gap-1.5">
            {consequence.points.map((point) => (
              <li
                key={point}
                className="flex items-baseline gap-2 text-sm text-secondary"
              >
                <span
                  className="size-1 shrink-0 rounded-full bg-fg-quaternary"
                  aria-hidden="true"
                />
                {point}
              </li>
            ))}
          </ul>
        </div>

        {isPreAccept && requiresTypeToConfirm && (
          <div className="mt-4">
            <TypeToConfirm
              target={orderId}
              value={typed}
              onChange={setTyped}
              hint="Not case sensitive. You can paste it."
              matchHint="Matches. The button is now active."
              errorHint="That does not match the order ID."
            />
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center justify-between gap-4 border-t border-secondary px-6 py-4">
        <span className="flex min-w-0 flex-col">
          <span className="text-xs font-medium text-tertiary">
            {isPreAccept ? preview.headlineLabel : "You would receive"}
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
            data-testid="cancelcommitstep-button"
          >
            Back
          </Button>
          <Button
            color="primary-destructive"
            size="md"
            isDisabled={!armed || isSubmitting}
            isLoading={isSubmitting}
            onClick={onConfirm}
            data-testid="cancelcommitstep-button-2"
          >
            {confirmLabel}
          </Button>
        </span>
      </div>
    </div>
  );
}
