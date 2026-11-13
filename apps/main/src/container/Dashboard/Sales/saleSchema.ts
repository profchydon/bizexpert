import { z } from "zod";
import type { PaymentMethod } from "@/types/bizexpert";

const optionalText = z.string().optional();

export const saleItemSchema = z.object({
  productId: z.string().uuid("Select a product"),
  quantity: z.coerce.number().positive("Enter a quantity"),
  unitName: optionalText,
  unitPrice: z.union([z.coerce.number().positive(), z.literal("")]).optional(),
  discountAmount: z.coerce.number().min(0).optional(),
});

export const saleFormSchema = z.object({
  locationId: z.string().uuid("Select a store"),
  customerId: z.union([z.string().uuid(), z.literal("")]).optional(),
  customerName: optionalText,
  paymentMethod: z.enum(["", "cash", "transfer", "pos", "credit"]).optional(),
  paymentReference: optionalText,
  notes: optionalText,
  discountAmount: z.coerce.number().min(0).optional(),
  items: z.array(saleItemSchema).min(1, "Add at least one item"),
});

export type SaleFormValues = z.infer<typeof saleFormSchema>;

export const saleFormDefaults: SaleFormValues = {
  locationId: "",
  customerId: "",
  customerName: "",
  paymentMethod: "cash",
  paymentReference: "",
  notes: "",
  discountAmount: 0,
  items: [
    {
      productId: "",
      quantity: 1,
      unitName: "",
      unitPrice: "",
      discountAmount: 0,
    },
  ],
};

export const PAYMENT_METHODS: { value: PaymentMethod | ""; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "transfer", label: "Transfer" },
  { value: "pos", label: "POS" },
  { value: "credit", label: "Credit" },
];

export function toCreateSalePayload(values: SaleFormValues) {
  const paymentMethod = values.paymentMethod || undefined;
  return {
    locationId: values.locationId,
    items: values.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitName: item.unitName?.trim() || undefined,
      unitPrice:
        item.unitPrice === "" || item.unitPrice === undefined
          ? undefined
          : Number(item.unitPrice),
      discountAmount: item.discountAmount || undefined,
    })),
    customerId: values.customerId || undefined,
    customerName: values.customerName?.trim() || undefined,
    paymentMethod,
    paymentReference: values.paymentReference?.trim() || undefined,
    notes: values.notes?.trim() || undefined,
    discountAmount: values.discountAmount || undefined,
  };
}
