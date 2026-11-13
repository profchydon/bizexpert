"use client";

import { Check, Copy01 } from "@untitledui/icons";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { useClipboard } from "@/hooks/use-clipboard";
import { cx } from "@/utils/cx";

export function CopyReferenceButton({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const { copy, copied } = useClipboard();
  const isCopied = copied === value;
  const Icon = isCopied ? Check : Copy01;

  return (
    <Tooltip title={isCopied ? "Copied" : "Copy reference"} placement="top">
      <TooltipTrigger
        aria-label={isCopied ? "Copied" : "Copy reference"}
        onPress={() => {
          void copy(value, value);
        }}
        className={cx(
          "inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-fg-quaternary outline-focus-ring transition duration-150 hover:bg-secondary hover:text-fg-quaternary_hover focus-visible:outline-2 focus-visible:outline-offset-2",
          isCopied && "text-fg-success-primary hover:text-fg-success-primary",
          className,
        )}
      >
        <Icon className="size-3.5" aria-hidden="true" />
      </TooltipTrigger>
    </Tooltip>
  );
}
