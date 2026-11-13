import type { IInStorageOrder } from "@/types/storageOrdersApi";

export const sampleInStorageOrder: IInStorageOrder = {
  id: "01a00625-b154-710a-b205-3af04e3f70f5",
  order_number: "RE-OFF-A70AD-2026",
  type: "offboarding",
  flow: "offboarding_to_storage",
  flow_label: "Offboarding to storage",
  direction: "into_storage",
  direction_label: "Into storage",
  status: "awaiting_response",
  quantity: 1,
  total_amount: 299.44,
  currency: "£",
  country: {
    id: "b9bbd993-6556-4186-a00b-61346f9f66be",
    name: "Nigeria",
    code: "NG",
  },
  entity: {
    id: "9de974c6-78c7-4ccc-ad7e-1a512dc832e8",
    name: "Intensa",
  },
  ordered_by: "Joe Andy",
  order_date: "2026-08-15T15:58:48.000000Z",
  sub_orders: [],
  equipment: [
    {
      id: "019f8abf-0c75-70ee-9d66-42425efe1a8f",
      title: "Apple Macbook Air M3",
      serial_number: null,
      type: "Macbook",
      make: "Apple",
      model: "MacBook Air",
      status: "request_storage",
    },
  ],
  custody_links: [],
};
