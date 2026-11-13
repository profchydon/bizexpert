import type { ComponentProps } from "react";
import Finch from "@/container/Dashboard/Settings/Integrations/Finch";

export type HrisFinchManageState = Omit<
  ComponentProps<typeof Finch>,
  "isOpen" | "onClose"
>;
