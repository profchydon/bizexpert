import { Button } from "@/components/ui/button";
import type { Sale } from "@/types/bizexpert";
import { canAddPayment, canCancelSale, canRefundSale } from "../saleTotals";

type Props = {
  sale: Sale;
  isDownloading: boolean;
  onBack: () => void;
  isBackPending: boolean;
  onInvoice: () => void;
  onShare: () => void;
  onPay: () => void;
  onCancel: () => void;
  onRefund: () => void;
};

export function SaleDetailActions({
  sale,
  isDownloading,
  onBack,
  isBackPending,
  onInvoice,
  onShare,
  onPay,
  onCancel,
  onRefund,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <Button
        variant="outline"
        size="md"
        isLoading={isBackPending}
        onClick={onBack}
      >
        Back
      </Button>
      <Button
        variant="outline"
        size="md"
        isLoading={isDownloading}
        onClick={onInvoice}
      >
        Invoice
      </Button>
      <Button variant="outline" size="md" onClick={onShare}>
        WhatsApp
      </Button>
      {canAddPayment(sale) ? (
        <Button variant="primary" size="md" onClick={onPay}>
          Add payment
        </Button>
      ) : null}
      {canCancelSale(sale) ? (
        <Button variant="outline" size="md" onClick={onCancel}>
          Cancel sale
        </Button>
      ) : null}
      {canRefundSale(sale) ? (
        <Button variant="outline" size="md" onClick={onRefund}>
          Refund
        </Button>
      ) : null}
    </div>
  );
}
