import { z } from "zod";
import type { CustomerLedgerType } from "@/types/bizexpert";

export const LEDGER_TYPE_OPTIONS: Array<{
  value: CustomerLedgerType;
  label: string;
}> = [
  { value: "wallet_credit", label: "Wallet deposit" },
  { value: "wallet_debit", label: "Wallet withdrawal" },
  { value: "debt", label: "Record debt" },
  { value: "repayment", label: "Record repayment" },
  { value: "write_off", label: "Write off" },
];

export const customerLedgerSchema = z.object({
  type: z.enum([
    "wallet_credit",
    "wallet_debit",
    "debt",
    "repayment",
    "write_off",
  ]),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  note: z.string().optional(),
});

export type CustomerLedgerValues = z.infer<typeof customerLedgerSchema>;

export function ledgerDefaults(type: CustomerLedgerType): CustomerLedgerValues {
  return { type, amount: 0, note: "" };
}

export function toLedgerPayload(values: CustomerLedgerValues) {
  const note = values.note?.trim();
  return {
    type: values.type,
    amount: values.amount,
    ...(note ? { note } : {}),
  };
}

export function formatLedgerType(type: string): string {
  return LEDGER_TYPE_OPTIONS.find((row) => row.value === type)?.label ?? type;
}
