"use client";

import type { ComponentType, ReactNode } from "react";
import { ChevronDown } from "@untitledui/icons";
import { cx } from "@/utils/cx";

interface MethodAccordionRowProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
  note: ReactNode;
  isOpen: boolean;
  onOpen: () => void;
  isDisabled?: boolean;
  badge?: ReactNode;
  children?: ReactNode;
  testId?: string;
}

type HeaderContentProps = Pick<
  MethodAccordionRowProps,
  "icon" | "title" | "note" | "isOpen" | "isDisabled" | "badge"
>;

function HeaderContent({
  icon: Icon,
  title,
  note,
  isOpen,
  isDisabled,
  badge,
}: HeaderContentProps) {
  const isActive = isOpen && !isDisabled;

  return (
    <>
      <span
        aria-hidden="true"
        className={cx(
          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border",
          isActive
            ? "border-brand bg-brand-primary"
            : "border-primary bg-primary",
        )}
      >
        {isActive && <span className="size-1.5 rounded-full bg-brand-solid" />}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex flex-wrap items-center gap-2">
          <Icon
            className="size-4 shrink-0 text-fg-quaternary"
            aria-hidden="true"
          />
          <span className="text-sm font-semibold text-primary">{title}</span>
          {badge}
        </span>
        <span className="text-xs text-tertiary">{note}</span>
      </span>
      {!isDisabled && (
        <ChevronDown
          className={cx(
            "mt-1 size-4 shrink-0 text-fg-quaternary transition-transform",
            isOpen && "rotate-180",
          )}
          aria-hidden="true"
        />
      )}
    </>
  );
}

const HEADER_CLASS = "flex w-full items-start gap-3 rounded-xl p-4 text-left";

export function MethodAccordionRow({
  icon,
  title,
  note,
  isOpen,
  onOpen,
  isDisabled,
  badge,
  children,
  testId,
}: MethodAccordionRowProps) {
  const content = (
    <HeaderContent
      icon={icon}
      title={title}
      note={note}
      isOpen={isOpen}
      isDisabled={isDisabled}
      badge={badge}
    />
  );

  return (
    <div
      data-testid={testId}
      className={cx(
        "rounded-xl border bg-primary transition-colors",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus-ring",
        isOpen && !isDisabled ? "border-brand" : "border-secondary",
        isDisabled && "opacity-60",
      )}
    >
      {isDisabled ? (
        <div
          aria-disabled="true"
          className={cx(HEADER_CLASS, "cursor-not-allowed")}
        >
          {content}
        </div>
      ) : (
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={onOpen}
          className={cx(HEADER_CLASS, "outline-none")}
        >
          {content}
        </button>
      )}
      {isOpen && !isDisabled && children && (
        <div className="flex flex-col gap-3 border-t border-secondary p-4">
          {children}
        </div>
      )}
    </div>
  );
}
