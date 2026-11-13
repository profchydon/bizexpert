import type { FlagTypes } from "./badge-types";

export const toBadgeFlag = (code?: string): FlagTypes | undefined => {
  if (!code) return undefined;
  return code.toUpperCase() as FlagTypes;
};
