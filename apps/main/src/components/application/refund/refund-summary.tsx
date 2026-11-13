"use client";

import { cx } from "@/utils/cx";
import {
  groupedRefundRows,
  type RefundPreview,
  type RefundRow,
} from "@/utils/refund-preview";

interface Props {
  preview: RefundPreview;
  className?: string;
}

function MoneyRow({ row, emphasis }: { row: RefundRow; emphasis?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1">
      <span
        className={cx(
          "text-sm",
          row.deduction
            ? "text-error-primary"
            : emphasis
              ? "font-medium text-primary"
              : "text-tertiary",
        )}
      >
        {row.label}
      </span>
      <span
        className={cx(
          "whitespace-nowrap text-sm font-medium",
          row.deduction ? "text-error-primary" : "text-primary",
        )}
      >
        {row.value}
      </span>
    </div>
  );
}

export function RefundSummaryRows({ preview, className }: Props) {
  const grouped = groupedRefundRows(preview.rows);
  const paymentRows = [
    ...grouped.payments,
    ...(grouped.subtotal ? [grouped.subtotal] : []),
  ];

  return (
    <div
      className={cx(
        "shrink-0 overflow-hidden rounded-xl border border-secondary",
        className,
      )}
    >
      {paymentRows.length > 0 && (
        <div className="flex flex-col px-4 pt-3">
          <span className="text-xs font-medium text-tertiary">Payment</span>
          <div className="mt-1 flex flex-col">
            {grouped.payments.map((row) => (
              <MoneyRow key={row.label} row={row} />
            ))}
            {grouped.subtotal ? (
              <div className="mt-1 border-t border-secondary pt-1">
                <MoneyRow row={grouped.subtotal} emphasis />
              </div>
            ) : null}
          </div>
        </div>
      )}

      {grouped.deductions.length > 0 && (
        <div className="flex flex-col px-4 pt-3">
          <span className="text-xs font-medium text-tertiary">Deductions</span>
          <div className="mt-1 flex flex-col">
            {grouped.deductions.map((row) => (
              <MoneyRow key={row.label} row={row} />
            ))}
          </div>
        </div>
      )}

      <div
        className={cx(
          "flex flex-col gap-0.5 bg-secondary px-4 py-3",
          paymentRows.length > 0 || grouped.deductions.length > 0
            ? "mt-3 border-t border-secondary"
            : "",
        )}
      >
        <span className="text-xs font-medium text-tertiary">
          {preview.headlineLabel}
        </span>
        <span className="text-xl font-semibold text-primary">
          {preview.headline}
        </span>
        {preview.destination && (
          <span className="flex items-center gap-1.5 text-xs text-secondary">
            <span
              className="size-1.5 shrink-0 rounded-full bg-success-solid"
              aria-hidden="true"
            />
            {preview.destination}
          </span>
        )}
      </div>

      <p className="px-4 pt-2 pb-3 text-xs text-tertiary">{preview.note}</p>
    </div>
  );
}
