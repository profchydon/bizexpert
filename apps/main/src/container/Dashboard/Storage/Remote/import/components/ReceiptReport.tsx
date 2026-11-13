import { AlertTriangle, ClipboardCheck, Download01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { cx } from "@/utils/cx";
import type { LineStatus, OpenFleetImport } from "../types";

const TONE: Record<LineStatus, string> = {
  received: "text-success-primary",
  missing: "text-error-primary",
  surplus: "text-brand-secondary",
  quarantined: "text-warning-primary",
};
const STATUS_LABEL: Record<LineStatus, string> = {
  received: "Received",
  missing: "Missing",
  surplus: "Surplus",
  quarantined: "Quarantined",
};

interface Props {
  imp: OpenFleetImport;
  onDownload: () => void;
  onBack: () => void;
  isBackLoading?: boolean;
  children?: React.ReactNode;
}

function varianceText(imp: OpenFleetImport): string | null {
  const r = imp.receipt;
  if (!r || r.variance === "none") return null;
  const missing = r.lines.filter((l) => l.status === "missing").length;
  const extra = r.lines.filter((l) => l.status === "surplus").length;
  if (r.variance === "shortfall")
    return `We received ${r.expected - missing} of ${r.expected} devices. ${missing} ${missing === 1 ? "is" : "are"} missing.`;
  if (r.variance === "surplus")
    return `We received ${extra} more device${extra === 1 ? "" : "s"} than listed. They've been added to your storage.`;
  return "A device we received doesn't match your list. It's been quarantined pending your decision.";
}

export function ReceiptReport({
  imp,
  onDownload,
  onBack,
  isBackLoading,
  children,
}: Props) {
  const r = imp.receipt;
  const banner = varianceText(imp);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <div className="flex items-start gap-4">
        <FeaturedIcon
          icon={ClipboardCheck}
          size="lg"
          color="brand"
          theme="light"
        />
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-primary">
            Inventory Receipt Report
          </h2>
          <p className="text-sm text-tertiary">
            {imp.country} · {imp.warehouse} ·{" "}
            {r ? `${r.received} of ${r.expected} received` : "Awaiting intake"}
          </p>
        </div>
        <Button
          size="md"
          color="secondary"
          iconLeading={Download01}
          onClick={onDownload}
          data-testid="receiptreport-button"
        >
          Download PDF
        </Button>
      </div>

      {banner && (
        <div className="flex flex-col gap-3 rounded-lg bg-warning-secondary p-4">
          <div className="flex gap-2">
            <AlertTriangle className="size-4 shrink-0 text-warning-primary" />
            <p className="text-sm text-warning-primary">{banner}</p>
          </div>
          {children}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-secondary">
        {r?.lines.map((line) => (
          <div
            key={line.id}
            className="flex items-center gap-3 border-b border-secondary px-4 py-3 last:border-b-0"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-primary">
                {line.deviceName}
              </p>
              <p className="text-xs text-tertiary">
                {line.serial} · {line.deviceType}
              </p>
            </div>
            {line.grade && (
              <span className="text-xs text-tertiary">Grade {line.grade}</span>
            )}
            <span
              className={cx(
                "w-24 text-right text-sm font-medium",
                TONE[line.status],
              )}
            >
              {STATUS_LABEL[line.status]}
            </span>
          </div>
        ))}
      </div>

      <Button
        size="md"
        color="secondary"
        isLoading={isBackLoading}
        onClick={onBack}
        className="self-start"
        data-testid="receiptreport-button-2"
      >
        Back to storage
      </Button>
    </div>
  );
}
