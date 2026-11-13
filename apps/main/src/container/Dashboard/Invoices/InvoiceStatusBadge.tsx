"use client";

import { BadgeWithDot } from "@/components/base/badges/badges";
import type { ITransactionInvoice } from "@/types/transactions";
import { invoiceBadgeLabel, invoiceBadgeTone } from "./invoiceFilterMeta";

const InvoiceStatusBadge = ({
  invoice,
}: {
  invoice?: ITransactionInvoice | null;
}) => (
  <BadgeWithDot color={invoiceBadgeTone(invoice)} size="sm" type="pill-color">
    {invoiceBadgeLabel(invoice)}
  </BadgeWithDot>
);

export default InvoiceStatusBadge;
