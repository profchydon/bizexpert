import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import type { StoredDevice } from "../types/storage";
import { freshnessTooltip } from "../utils/badgeTooltips";
import {
  checkAgeDays,
  checkFreshnessLabel,
  freshnessTier,
} from "../utils/deriveDevice";

export function CheckFreshness({ device }: { device: StoredDevice }) {
  const tier = freshnessTier(device);
  const days = checkAgeDays(device);
  const copy = checkFreshnessLabel(device);
  if (tier === "none" || days == null || !copy) return null;
  const tone =
    tier === "very_stale"
      ? "text-error-primary"
      : tier === "stale"
        ? "text-warning-primary"
        : "text-tertiary";
  return (
    <Tooltip title={freshnessTooltip(tier, days)} placement="top">
      <TooltipTrigger className="cursor-default">
        <span className={`text-sm ${tone}`}>{copy}</span>
      </TooltipTrigger>
    </Tooltip>
  );
}
