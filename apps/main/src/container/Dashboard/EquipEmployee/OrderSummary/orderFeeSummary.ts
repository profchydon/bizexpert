export type OrderFeeSummary = {
  plan?: {
    amount?: number | string | null;
    service_type?: string;
  };
  additional_fee?: {
    insurance_fee?: number | string | null;
  };
  purchase_price?: number | string | null;
  total_fee?: number | string | null;
};
