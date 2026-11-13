"use client";

import type { ReactNode } from "react";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { ADDRESS_LOCK_TOOLTIP } from "./editEmployeeFormOptions";

export const EDIT_EMPLOYEE_FORM_ROW_CLASS = "grid grid-cols-2 gap-4";

export function EditEmployeeLockedField({
  locked,
  children,
}: {
  locked: boolean;
  children: ReactNode;
}) {
  if (!locked) return children;
  return (
    <Tooltip title={ADDRESS_LOCK_TOOLTIP} placement="top">
      <TooltipTrigger className="w-full">{children}</TooltipTrigger>
    </Tooltip>
  );
}
