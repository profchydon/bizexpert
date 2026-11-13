"use client";

import type { FC, ReactNode } from "react";
import { useState } from "react";
import { ChevronDown } from "@untitledui/icons";
import { cx } from "@/utils/cx";

/** A header that may change with the disclosure state, e.g. a summary that hands its
 *  numbers back to the body once the body is visible. */
type CardAction = ReactNode | ((open: boolean) => ReactNode);

interface DetailCardProps {
  title: string;
  action?: CardAction;
  children: ReactNode;
  /**
   * Turns the header into a disclosure button. Reference-heavy sections use this so they
   * stop costing a screen of height each. `action` sits beside the button rather than
   * inside it, so it may be interactive: a tooltipped badge, a menu, a link.
   */
  collapsible?: boolean;
  defaultOpen?: boolean;
}

/**
 * The disclosure header on its own, so a card that cannot be a DetailCard can still get
 * the same behaviour. `TableCard` has no disclosure support and nesting one inside a
 * DetailCard would draw the card chrome twice, so AppInventoryCard uses this directly.
 *
 * The action is a sibling of the button, not a child of it, so it can hold a tooltipped
 * badge or a menu without nesting one control inside another. The cost is that only the
 * chevron and title toggle: clicking a badge for its tooltip should not collapse the card.
 */
export function CardDisclosureHeader({
  title,
  action,
  open,
  onToggle,
}: {
  title: string;
  action?: CardAction;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cx(
        "flex w-full items-center justify-between gap-3 rounded-t-xl px-5 py-3.5",
        open ? "border-b border-secondary" : "rounded-b-xl",
      )}
    >
      {/* Button inside the heading is the accessible disclosure pattern. A heading inside
          a button would be invalid, since a button only takes phrasing content. */}
      <h2 className="flex min-w-0 flex-1">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex min-w-0 items-center gap-2 rounded-md text-left outline-focus-ring hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <ChevronDown
            className={cx(
              "size-4 shrink-0 text-fg-quaternary transition-transform",
              !open && "-rotate-90",
            )}
          />
          <span className="text-md font-semibold text-primary">{title}</span>
        </button>
      </h2>
      {typeof action === "function" ? action(open) : action}
    </div>
  );
}

export function DetailCard({
  title,
  action,
  children,
  collapsible = false,
  defaultOpen = true,
}: DetailCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  if (!collapsible) {
    return (
      <section className="rounded-xl border border-secondary bg-primary shadow-xs">
        <div className="flex items-center justify-between gap-3 border-b border-secondary px-5 py-3.5">
          <h2 className="text-md font-semibold text-primary">{title}</h2>
          {typeof action === "function" ? action(true) : action}
        </div>
        <div className="p-5">{children}</div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-secondary bg-primary shadow-xs">
      <CardDisclosureHeader
        title={title}
        action={action}
        open={open}
        onToggle={() => setOpen((v) => !v)}
      />
      {open && <div className="p-5">{children}</div>}
    </section>
  );
}

export function DetailGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-4">
      {children}
    </div>
  );
}

interface FieldProps {
  label: string;
  icon?: FC<{ className?: string }>;
  children: ReactNode;
  wide?: boolean;
}

export function DetailField({ label, icon: Icon, children, wide }: FieldProps) {
  return (
    <div
      className={cx(
        "flex min-w-0 flex-col gap-1.5",
        wide && "col-span-2 lg:col-span-4",
      )}
    >
      <span className="flex items-center gap-1.5 text-xs font-medium text-tertiary">
        {Icon && <Icon className="size-4 shrink-0 text-fg-quaternary" />}
        {label}
      </span>
      <span className="text-sm font-medium break-words text-primary">
        {children}
      </span>
    </div>
  );
}
