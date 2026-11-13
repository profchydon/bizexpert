import type { Sale } from "@/types/bizexpert";

export function salePaidTotal(sale: Sale): number {
  return (sale.payments ?? []).reduce(
    (sum, payment) => sum + Number(payment.amount ?? 0),
    0,
  );
}

export function saleOutstanding(sale: Sale): number {
  return Math.max(0, Number(sale.totalAmount ?? 0) - salePaidTotal(sale));
}

export function canCancelSale(sale: Sale): boolean {
  return sale.status === "completed";
}

export function canRefundSale(sale: Sale): boolean {
  return sale.status === "completed";
}

export function canAddPayment(sale: Sale): boolean {
  return sale.status === "completed" && saleOutstanding(sale) > 0;
}
