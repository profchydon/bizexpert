"use client";

import Finch from "@/container/Dashboard/Settings/Integrations/Finch";
import type { HrisFinchManageState } from "./hrisFinchManageState";

type Props = {
  state: HrisFinchManageState | null;
  onClose: () => void;
};

export function HrisFinchManageModal({ state, onClose }: Props) {
  if (!state) {
    return null;
  }

  return <Finch isOpen onClose={onClose} {...state} />;
}
