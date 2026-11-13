import { IOrder } from "./employees";

interface ITransaction {
  country_id: string;
  shipping_fee: number;
  redirect_url: string;
  orders: IOrder[];
}

export interface ITransactionInvoice {
  id?: string | null;
  number?: string | null;
  status?: string | null;
  url?: string | null;
  pdf_url?: string | null;
  paid_at?: string | null;
}

export interface IAllTransaction {
  id: string;
  reference: string;
  entity_name?: string | null;
  initiated_by?: string | null;
  payment_link: string;
  amount: string | number;
  payment: string;
  method: string;
  number_of_equipments: number;
  date: string;
  currency_symbol: string;
  order_id: string | null;
  multiple_order_details?: Array<{
    order_id: string;
    order_number?: string | null;
    quantity?: number;
    country_id: string;
    country_code: string;
    country_name: string;
    type?: string;
  }>;
  order_number: string | null;
  wallet_kind?: "top_up" | "cancellation_refund" | null;
  refund?: number;
  refund_reason?: string | null;
  invoice?: ITransactionInvoice | null;
  status:
    | "Pending"
    | "Awaiting Payment"
    | "Successful"
    | "Failed"
    | "Canceled"
    | "Refunded"
    | "Partial Refund"
    | "Disputed"
    | "Fulfilled";
}

export interface ITransactionOrderDetail {
  order_id: string;
  order_number?: string | null;
  quantity?: number;
  country_id: string;
  country_code: string;
  country_name: string;
  type?: string;
  status?: string;
  total_amount?: number | string;
  refunded_amount?: number;
}

export interface ITransactionDetail extends IAllTransaction {
  multiple_order_details?: ITransactionOrderDetail[];
  items_details?: Array<{
    name: string;
    devices?: number;
    quantity: number;
    type: string;
    unit_price: number;
    amount: number;
  }>;
  tax_breakdown?: {
    device_tax: number;
    service_tax: number;
    tax_metadata: {
      device_tax_rate: number;
      service_tax_rate: number;
      device_tax_amount: number;
      service_tax_amount: number;
      tax_label_device: string | null;
      tax_label_service: string | null;
    } | null;
  };
  gateway_fee?: number;
  created_at?: string;
  updated_at?: string;
}

export type TransactionRequest = {
  companyId: string;
  payload: ITransaction;
};

export type GetAllTransactionResponse =
  ServerPaginatedResponse<IAllTransaction>;

export type GetTransactionDetailResponse = ServerResponse<ITransactionDetail>;
