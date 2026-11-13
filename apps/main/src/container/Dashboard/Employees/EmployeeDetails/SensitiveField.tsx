"use client";

import { Check, Copy01, Eye, EyeOff } from "@untitledui/icons";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import {
  maskedDots,
  sensitiveFieldActionsClass,
  sensitiveFieldLabelClass,
  sensitiveFieldRowClass,
  sensitiveFieldValueClass,
} from "./sensitiveFieldClasses";

type Props = {
  label: string;
  value: string;
  copyId: string;
  copied: string | boolean;
  onCopy: (text: string, id: string) => void;
  isRevealed: boolean;
  onToggleReveal: () => void;
};

const actionButtonClass =
  "rounded p-1 text-fg-quaternary outline-focus-ring transition hover:text-fg-quaternary_hover focus-visible:outline-2 focus-visible:outline-offset-2";

const SensitiveField = ({
  label,
  value,
  copyId,
  copied,
  onCopy,
  isRevealed,
  onToggleReveal,
}: Props) => {
  const isCopied = copied === copyId;

  return (
    <div className="flex w-full flex-col gap-1">
      <span className={sensitiveFieldLabelClass}>{label}</span>
      <div className={sensitiveFieldRowClass}>
        <span className={sensitiveFieldValueClass(isRevealed)}>
          {isRevealed ? value : maskedDots(value)}
        </span>
        <div className={sensitiveFieldActionsClass}>
          <button
            type="button"
            aria-label={isRevealed ? `Hide ${label}` : `Reveal ${label}`}
            aria-pressed={isRevealed}
            onClick={onToggleReveal}
            className={actionButtonClass}
          >
            {isRevealed ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
          <Tooltip title={isCopied ? "Copied" : "Copy"} placement="top">
            <TooltipTrigger
              aria-label={`Copy ${label}`}
              onPress={() => onCopy(value, copyId)}
              className={actionButtonClass}
            >
              {isCopied ? (
                <Check className="size-4 text-fg-success-primary" />
              ) : (
                <Copy01 className="size-4" />
              )}
            </TooltipTrigger>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default SensitiveField;
