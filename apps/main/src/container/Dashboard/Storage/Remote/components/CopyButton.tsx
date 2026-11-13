"use client";

import { Check, Copy01 } from "@untitledui/icons";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { useClipboard } from "@/hooks/use-clipboard";

export function CopyButton({
  value,
  label = "Copy",
}: {
  value: string;
  label?: string;
}) {
  const { copied, copy } = useClipboard();
  const isCopied = copied === value;
  return (
    <ButtonUtility
      size="xs"
      color="tertiary"
      icon={isCopied ? Check : Copy01}
      tooltip={isCopied ? "Copied" : label}
      onClick={() => copy(value, value)}
    />
  );
}
