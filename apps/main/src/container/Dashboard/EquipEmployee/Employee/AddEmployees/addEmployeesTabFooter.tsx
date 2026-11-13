"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { addEmployeesFooterBorderClass } from "./addEmployeesBorderClasses";

type Props = {
  children: ReactNode;
  justify?: "between" | "end";
  className?: string;
};

export function AddEmployeesTabFooter({
  children,
  justify = "end",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex w-full shrink-0 items-center gap-3 px-6 py-4",
        addEmployeesFooterBorderClass,
        justify === "between" ? "justify-between" : "justify-end",
        className,
      )}
    >
      {children}
    </div>
  );
}
