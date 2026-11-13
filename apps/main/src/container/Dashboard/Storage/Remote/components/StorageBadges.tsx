import { Badge } from "@/components/base/badges/badges";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import {
  GRADE_COLOR,
  ORDER_DIRECTION_COLOR,
  ORDER_DIRECTION_LABEL,
  ORDER_KIND_COLOR,
  ORDER_KIND_LABEL,
  REQUEST_STATUS_COLOR,
  REQUEST_STATUS_LABEL,
  SOURCE_COLOR,
  SOURCE_LABEL,
  STATUS_COLOR,
  STATUS_LABEL,
  WIPE_COLOR,
  WIPE_LABEL,
} from "../data/storageMeta";
import type {
  EntrySource,
  Grade,
  OrderDirection,
  OrderKind,
  RequestStatus,
  StorageStatus,
  WipeStatus,
} from "../types/storage";
import {
  GRADE_TOOLTIP,
  ORDER_DIRECTION_TOOLTIP,
  ORDER_KIND_TOOLTIP,
  REQUEST_STATUS_TOOLTIP,
  SOURCE_TOOLTIP,
  STATUS_TOOLTIP,
  WIPE_TOOLTIP,
} from "../utils/badgeTooltips";
import { formatGradeBadgeLabel } from "../utils/formatGradeBadgeLabel";

function TipBadge({
  title,
  color,
  label,
}: {
  title: string;
  color: Parameters<typeof Badge>[0]["color"];
  label: string;
}) {
  return (
    <Tooltip title={title} placement="top">
      <TooltipTrigger className="cursor-default">
        <Badge size="sm" type="pill-color" color={color}>
          {label}
        </Badge>
      </TooltipTrigger>
    </Tooltip>
  );
}

export function StatusBadge({
  status,
  label,
}: {
  status: StorageStatus;
  label?: string;
}) {
  return (
    <TipBadge
      title={STATUS_TOOLTIP[status]}
      color={STATUS_COLOR[status]}
      label={label?.trim() ? label : STATUS_LABEL[status]}
    />
  );
}

export function SourceBadge({
  source,
  label,
}: {
  source: EntrySource;
  label?: string;
}) {
  const text = label?.trim() || SOURCE_LABEL[source];
  return (
    <TipBadge
      title={SOURCE_TOOLTIP[source]}
      color={SOURCE_COLOR[source]}
      label={text}
    />
  );
}

export function WipeBadge({
  status,
  label,
}: {
  status: WipeStatus;
  label?: string;
}) {
  return (
    <TipBadge
      title={WIPE_TOOLTIP[status]}
      color={WIPE_COLOR[status]}
      label={label?.trim() || WIPE_LABEL[status]}
    />
  );
}

export function GradeBadge({ grade, label }: { grade: Grade; label?: string }) {
  return (
    <TipBadge
      title={GRADE_TOOLTIP[grade]}
      color={GRADE_COLOR[grade]}
      label={formatGradeBadgeLabel(grade, label)}
    />
  );
}

export function RequestStatusBadge({
  status,
  label,
}: {
  status: RequestStatus;
  label?: string;
}) {
  return (
    <TipBadge
      title={REQUEST_STATUS_TOOLTIP[status]}
      color={REQUEST_STATUS_COLOR[status]}
      label={label?.trim() || REQUEST_STATUS_LABEL[status]}
    />
  );
}

export function OrderKindBadge({ kind }: { kind: OrderKind }) {
  return (
    <TipBadge
      title={ORDER_KIND_TOOLTIP[kind]}
      color={ORDER_KIND_COLOR[kind]}
      label={ORDER_KIND_LABEL[kind]}
    />
  );
}

// The order's "type": an intake reads as its entry source (Offboarding, Buy to
// Storage, …); everything else keeps its kind badge.
export function OrderTypeBadge({
  kind,
  entrySource,
  flowLabel,
}: {
  kind: OrderKind;
  entrySource?: EntrySource;
  flowLabel?: string;
}) {
  if (flowLabel) {
    return (
      <TipBadge
        title={flowLabel}
        color={ORDER_KIND_COLOR[kind]}
        label={flowLabel}
      />
    );
  }
  if (kind === "intake" && entrySource)
    return <SourceBadge source={entrySource} />;
  return <OrderKindBadge kind={kind} />;
}

export function MovementBadge({
  direction,
  directionLabel,
}: {
  direction: OrderDirection;
  directionLabel?: string;
}) {
  const label = directionLabel ?? ORDER_DIRECTION_LABEL[direction];
  return (
    <TipBadge
      title={ORDER_DIRECTION_TOOLTIP[direction]}
      color={ORDER_DIRECTION_COLOR[direction]}
      label={label}
    />
  );
}
