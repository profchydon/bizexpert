"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { isValidElement, useContext } from "react";
import { Badge } from "@/components/base/badges/badges";
import { cx } from "@/utils/cx";
import { TableContext, type TableSize } from "./table-context";

export const TableCardRoot = ({
  children,
  className,
  size = "md",
  ...props
}: HTMLAttributes<HTMLDivElement> & { size?: TableSize }) => (
  <TableContext.Provider value={{ size }}>
    <div
      {...props}
      className={cx(
        "relative overflow-hidden rounded-xl bg-primary shadow-xs ring-1 ring-secondary after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-secondary",
        className,
      )}
    >
      {children}
    </div>
  </TableContext.Provider>
);

type TableCardHeaderProps = {
  title: string;
  badge?: ReactNode;
  description?: string;
  contentTrailing?: ReactNode;
  className?: string;
};

function renderTableCardBadge(badge: ReactNode) {
  if (isValidElement(badge)) return badge;
  return (
    <Badge color="brand" size="sm">
      {badge}
    </Badge>
  );
}

export const TableCardHeader = ({
  title,
  badge,
  description,
  contentTrailing,
  className,
}: TableCardHeaderProps) => {
  const { size } = useContext(TableContext);

  return (
    <div
      className={cx(
        "relative flex flex-col items-start gap-4 border-b border-border-secondary bg-primary px-4 md:flex-row",
        size === "sm" ? "py-4 md:px-5" : "py-5 md:px-6",
        className,
      )}
    >
      <div className="flex flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <h2
            className={cx(
              "font-semibold text-primary",
              size === "sm" ? "text-md" : "text-lg",
            )}
          >
            {title}
          </h2>
          {badge ? renderTableCardBadge(badge) : null}
        </div>
        {description ? (
          <p className="text-sm text-tertiary">{description}</p>
        ) : null}
      </div>
      {contentTrailing}
    </div>
  );
};

export const TableCard = {
  Root: TableCardRoot,
  Header: TableCardHeader,
};
