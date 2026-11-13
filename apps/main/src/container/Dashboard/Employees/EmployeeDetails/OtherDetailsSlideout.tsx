"use client";

import { useState } from "react";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/base/buttons/button";
import { useClipboard } from "@/hooks/useClipboard";
import type { IEmployees } from "@/types/employees";
import SensitiveField from "./SensitiveField";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  employee?: IEmployees;
};

const formatValue = (value?: string | null) => value?.trim() || "—";

const OtherDetailsSlideout = ({ isOpen, onClose, employee }: Props) => {
  const { copied, copy } = useClipboard();
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const fields = [
    {
      id: "personal-email",
      label: "Personal email",
      value: formatValue(employee?.personal_email),
    },
    {
      id: "work-email",
      label: "Work email",
      value: formatValue(employee?.email),
    },
    {
      id: "phone",
      label: "Phone number",
      value: formatValue(employee?.phone),
    },
    {
      id: "tax",
      label: "Employee tax identification number",
      value: formatValue(employee?.tax_number),
    },
    {
      id: "address",
      label: "Address",
      value: formatValue(employee?.address),
    },
  ];

  return (
    <SlideoutMenu
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      isDismissable
    >
      <SlideoutMenu.Header
        onClose={onClose}
        className="pb-5 shadow-[inset_0px_-1px_0px_0px] shadow-border-secondary"
      >
        <div className="flex flex-col gap-1 pr-8">
          <h2 className="text-lg font-semibold text-primary">Other details</h2>
          <p className="text-sm text-tertiary">
            Sensitive contact and identity details. Reveal or copy each value.
          </p>
        </div>
      </SlideoutMenu.Header>

      <SlideoutMenu.Content className="w-full">
        <div className="flex w-full flex-col gap-5">
          {fields.map((field) => (
            <SensitiveField
              key={field.id}
              label={field.label}
              value={field.value}
              copyId={field.id}
              copied={copied}
              onCopy={copy}
              isRevealed={revealed.has(field.id)}
              onToggleReveal={() => toggle(field.id)}
            />
          ))}
        </div>
      </SlideoutMenu.Content>

      <SlideoutMenu.Footer>
        <div className="flex justify-end">
          <Button
            size="md"
            color="secondary"
            onClick={onClose}
            data-testid="otherdetailsslideout-button"
          >
            Close
          </Button>
        </div>
      </SlideoutMenu.Footer>
    </SlideoutMenu>
  );
};

export default OtherDetailsSlideout;
