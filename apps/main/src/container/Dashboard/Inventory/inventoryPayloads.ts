export type StockFormValues = {
  productId: string;
  quantity: number;
  unitCost: number;
  notes?: string;
};

export type AdjustFormValues = {
  productId: string;
  quantity: number;
  reason: string;
};

export type TransferFormValues = {
  sourceLocationId: string;
  destinationLocationId: string;
  productId: string;
  quantity: number;
  notes?: string;
};

export function toOpeningPayload(locationId: string, values: StockFormValues) {
  return {
    locationId,
    productId: values.productId,
    quantity: values.quantity,
    unitCost: values.unitCost,
  };
}

export function toReceivePayload(locationId: string, values: StockFormValues) {
  return {
    locationId,
    productId: values.productId,
    quantity: values.quantity,
    unitCost: values.unitCost,
    notes: values.notes?.trim() || undefined,
  };
}

export function toAdjustPayload(locationId: string, values: AdjustFormValues) {
  return {
    locationId,
    productId: values.productId,
    quantity: values.quantity,
    reason: values.reason.trim(),
  };
}

export function toTransferPayload(values: TransferFormValues) {
  return {
    sourceLocationId: values.sourceLocationId,
    destinationLocationId: values.destinationLocationId,
    notes: values.notes?.trim() || undefined,
    items: [{ productId: values.productId, quantity: values.quantity }],
  };
}
