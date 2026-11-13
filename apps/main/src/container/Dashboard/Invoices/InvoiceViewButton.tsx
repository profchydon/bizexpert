"use client";

import { ArrowUpRight } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import type { ITransactionInvoice } from "@/types/transactions";
import { invoiceViewUrl } from "./invoiceFilterMeta";

const InvoiceViewButton = ({
  invoice,
  fullWidth,
}: {
  invoice?: ITransactionInvoice | null;
  fullWidth?: boolean;
}) => {
  const href = invoiceViewUrl(invoice);

  return (
    <Button
      size={fullWidth ? "md" : "sm"}
      color="secondary"
      iconTrailing={ArrowUpRight}
      isDisabled={!href}
      href={href || undefined}
      target="_blank"
      rel="noopener noreferrer"
      className={fullWidth ? "w-full" : undefined}
      data-testid="invoiceviewbutton-button"
    >
      View
    </Button>
  );
};

export default InvoiceViewButton;
