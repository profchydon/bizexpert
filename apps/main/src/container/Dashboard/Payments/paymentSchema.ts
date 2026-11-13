import { z } from "zod";
import { formatNgn } from "@/lib/bizexpert/format";
import type { Sale } from "@/types/bizexpert";
import { canAddPayment, saleOutstanding } from "../Sales/saleTotals";

export const CREATE_PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "transfer", label: "Transfer" },
  { value: "pos", label: "POS" },
] as const;

export const createPaymentSchema = z.object({
  saleId: z.string().uuid("Select a sale"),
  amount: z.coerce.number().positive("Enter an amount"),
  method: z.enum(["cash", "transfer", "pos"]),
  reference: z.string().optional(),
});

export type CreatePaymentValues = z.infer<typeof createPaymentSchema>;

export const createPaymentDefaults: CreatePaymentValues = {
  saleId: "",
  amount: 0,
  method: "cash",
  reference: "",
};

export function unpaidSalesForPayment(sales: Sale[]): Sale[] {
  return sales.filter(canAddPayment);
}

export function unpaidSaleLabel(sale: Sale): string {
  const who = sale.customerName?.trim() || "Walk-in";
  return `${sale.saleNumber} · ${who} · ${formatNgn(saleOutstanding(sale))} due`;
}

export function toCreatePaymentPayload(values: CreatePaymentValues) {
  return {
    amount: values.amount,
    method: values.method,
    reference: values.reference?.trim() || undefined,
  };
}
