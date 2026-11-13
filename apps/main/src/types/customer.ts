export type CustomerLedgerType =
  "wallet_credit" | "wallet_debit" | "debt" | "repayment" | "write_off";

export interface CustomerLedger {
  id: string;
  customerId: string;
  type: CustomerLedgerType;
  amount: number | string;
  note?: string | null;
  saleId?: string | null;
  createdAt: string;
}

export interface CustomerSale {
  id: string;
  saleNumber: string;
  totalAmount: number | string;
  paymentStatus: string;
  status: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
  creditLimit: number | string;
  walletBalance: number | string;
  outstandingBalance: number | string;
  isActive: boolean;
  saleCount: number;
  totalSpent: number | string;
  ledger?: CustomerLedger[];
  sales?: CustomerSale[];
}
