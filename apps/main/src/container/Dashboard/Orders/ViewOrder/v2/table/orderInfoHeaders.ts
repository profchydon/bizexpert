import type { SortKey } from "./orderInfoRowValues";

export interface OrderInfoHeader {
  id: string;
  label: string;
  help?: string;
  sortKey?: SortKey;
}

const STATUS_HEADER: OrderInfoHeader = {
  id: "status",
  label: "Order status",
  help: "Fulfillment progress for this employee's items.",
  sortKey: "status",
};

const SIGNATURE_HEADER: OrderInfoHeader = {
  id: "signature",
  label: "Signature",
  help: "Whether a recipient signature is required on delivery.",
  sortKey: "signature",
};

export function getHeaders(isOffboarding: boolean): OrderInfoHeader[] {
  return [
    { id: "name", label: "Name", sortKey: "name" },
    { id: "address", label: "Address", sortKey: "address" },
    isOffboarding
      ? { id: "actionType", label: "Action type" }
      : { id: "amount", label: "Total amount", sortKey: "amount" },
    STATUS_HEADER,
    SIGNATURE_HEADER,
  ];
}
