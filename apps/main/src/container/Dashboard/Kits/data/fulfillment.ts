import type { FulfillmentMode } from "../types";

export const fulfillmentOptions: {
  value: FulfillmentMode;
  label: string;
  hint: string;
}[] = [
  {
    value: "split",
    label: "Split OK",
    hint: "Available items ship immediately. Unavailable required items trigger an RFQ. Optional unavailable items are skipped.",
  },
  {
    value: "hold",
    label: "Hold Until Complete",
    hint: "Nothing ships until all required items are sourced. Storage reserves are held while RFQs are pending.",
  },
];
