"use client";

import type { SortDescriptor } from "react-aria-components";
import type { SubscriptionBillingInvoice } from "@/api/baseQueries/companiesApi/subscriptionsApi/subscriptionContract";
import { Table } from "@/components/application/table/table";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { DisabledWithTooltip } from "@/components/base/tooltip/disabled-with-tooltip";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import {
  invoiceStatusColor,
  invoiceStatusLabel,
  invoiceStatusTooltip,
} from "./billingInvoices";
import { formatBillingDate } from "./subscriptionView";

const STICKY_ACTION_HEAD = "sticky right-0 z-1 bg-secondary max-w-32";
const STICKY_ACTION_CELL =
  "sticky right-0 z-1 bg-primary group-hover:bg-secondary";

const columns = [
  {
    id: "number",
    label: "Invoice",
    tooltip: "Reference for this month's subscription charge.",
  },
  {
    id: "billed_on",
    label: "Billed on",
    tooltip: "The day the charge was raised.",
  },
  {
    id: "plan",
    label: "Plan",
    tooltip: "The plan you were on for that cycle.",
  },
  {
    id: "devices",
    label: "Devices",
    tooltip: "Billable devices counted for that cycle.",
  },
  { id: "amount", label: "Amount", tooltip: "Total charged for that cycle." },
  {
    id: "status",
    label: "Status",
    tooltip: "Whether the charge went through.",
  },
  { id: "actions", label: "", tooltip: undefined },
];

export function BillingHistoryTable({
  rows,
  sort,
  onSortChange,
  onView,
  downloadUrl,
}: {
  rows: SubscriptionBillingInvoice[];
  sort: SortDescriptor;
  onSortChange: (sort: SortDescriptor) => void;
  onView: (invoice: SubscriptionBillingInvoice) => void;
  downloadUrl: (invoice: SubscriptionBillingInvoice) => string | null;
}) {
  return (
    <Table
      aria-label="Billing history"
      className="min-w-[860px]"
      sortDescriptor={sort}
      onSortChange={onSortChange}
    >
      <Table.Header columns={columns}>
        {(column) => (
          <Table.Head
            id={column.id}
            label={column.label}
            tooltip={column.tooltip}
            allowsSorting={column.id !== "actions"}
            isRowHeader={column.id === "number"}
            className={column.id === "actions" ? STICKY_ACTION_HEAD : undefined}
          />
        )}
      </Table.Header>
      <Table.Body items={rows}>
        {(row) => {
          const invoice = row as SubscriptionBillingInvoice;
          const href = downloadUrl(invoice);
          return (
            <Table.Row id={invoice.id} className="group">
              <Table.Cell className="font-medium text-primary">
                {invoice.number}
              </Table.Cell>
              <Table.Cell className="text-tertiary">
                {formatBillingDate(invoice.billed_on) || "—"}
              </Table.Cell>
              <Table.Cell className="text-secondary">
                {invoice.plan?.name ? `Rayda ${invoice.plan.name}` : "—"}
              </Table.Cell>
              <Table.Cell className="text-secondary tabular-nums">
                {invoice.device_count}
              </Table.Cell>
              <Table.Cell className="text-secondary tabular-nums">
                {invoice.amount_display || "—"}
              </Table.Cell>
              <Table.Cell>
                <Tooltip
                  title={invoiceStatusTooltip(invoice.status)}
                  placement="top"
                >
                  <TooltipTrigger className="cursor-default">
                    <Badge
                      color={invoiceStatusColor(invoice.status)}
                      size="sm"
                      type="pill-color"
                    >
                      {invoiceStatusLabel(invoice.status)}
                    </Badge>
                  </TooltipTrigger>
                </Tooltip>
              </Table.Cell>
              <Table.Cell className={STICKY_ACTION_CELL}>
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    color="link-color"
                    onClick={() => onView(invoice)}
                    data-testid="billinghistorytable-button"
                  >
                    View
                  </Button>
                  {href ? (
                    <Button
                      size="sm"
                      color="link-gray"
                      href={href}
                      target="_blank"
                      data-testid="billinghistorytable-button-2"
                    >
                      Download
                    </Button>
                  ) : (
                    <DisabledWithTooltip
                      isDisabled
                      reason="A PDF is not ready for this invoice yet."
                    >
                      <Button
                        size="sm"
                        color="link-gray"
                        isDisabled
                        data-testid="billinghistorytable-button-3"
                      >
                        Download
                      </Button>
                    </DisabledWithTooltip>
                  )}
                </div>
              </Table.Cell>
            </Table.Row>
          );
        }}
      </Table.Body>
    </Table>
  );
}
