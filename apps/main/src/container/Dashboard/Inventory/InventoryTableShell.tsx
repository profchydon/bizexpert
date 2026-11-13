"use client";

import type { ReactNode } from "react";
import {
  inventoryTableCountBadgeClass,
  inventoryTableShellClass,
  inventoryTableTitleClass,
  inventoryTableToolbarClass,
} from "./inventoryPageClasses";

type Props = {
  title: string;
  count?: number;
  toolbar?: ReactNode;
  children: ReactNode;
};

export function InventoryTableShell({
  title,
  count,
  toolbar,
  children,
}: Props) {
  return (
    <div className={inventoryTableShellClass}>
      <div className={inventoryTableToolbarClass}>
        <h3 className={inventoryTableTitleClass}>
          {title}
          {count ? (
            <span className={inventoryTableCountBadgeClass}>{count}</span>
          ) : null}
        </h3>
        {toolbar ? (
          <div className="flex flex-row gap-x-2">{toolbar}</div>
        ) : null}
      </div>
      {children}
    </div>
  );
}
