export type SaleStatus = "completed" | "cancelled" | "refunded";
export type SaleSource = "web" | "whatsapp";
export type PaymentStatus = "paid" | "partial" | "credit";
export type PaymentMethod = "cash" | "transfer" | "pos" | "credit";

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  productName: string;
  unitName: string;
  quantity: number | string;
  unitPrice: number | string;
  discountAmount: number | string;
  lineTotal: number | string;
  unitCostSnapshot: number | string;
  lineCost: number | string;
  lineProfit: number | string;
}

export interface SalePayment {
  id: string;
  saleId: string;
  amount: number | string;
  method: PaymentMethod;
  reference?: string | null;
  paidAt: string;
}

export interface Sale {
  id: string;
  saleNumber: string;
  businessId: string;
  locationId: string;
  userId: string;
  source: SaleSource;
  status: SaleStatus;
  subtotal: number | string;
  discountAmount: number | string;
  totalAmount: number | string;
  totalCost: number | string;
  grossProfit: number | string;
  paymentStatus: PaymentStatus;
  customerId?: string | null;
  customerName?: string | null;
  notes?: string | null;
  cancelReason?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  updatedAt: string;
  saleItems?: SaleItem[];
  payments?: SalePayment[];
  location?: { id: string; name: string };
}

export type SalesListResponse = {
  data: Sale[];
  total: number;
};

export interface PaymentListItem extends SalePayment {
  sale?: Pick<
    Sale,
    | "id"
    | "saleNumber"
    | "customerName"
    | "locationId"
    | "paymentStatus"
    | "totalAmount"
    | "status"
  > & { location?: { id: string; name: string } };
}

export type PaymentsListResponse = {
  data: PaymentListItem[];
  total: number;
};
