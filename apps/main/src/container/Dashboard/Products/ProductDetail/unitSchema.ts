import { z } from "zod";

export const addUnitSchema = z.object({
  unitName: z.string().trim().min(1, "Unit name is required"),
  conversionFactor: z.coerce
    .number()
    .positive("Conversion factor must be greater than 0"),
  sellingPrice: z.coerce.number().min(0).optional(),
});

export type AddUnitValues = z.infer<typeof addUnitSchema>;

export const addUnitDefaults: AddUnitValues = {
  unitName: "",
  conversionFactor: 0,
  sellingPrice: 0,
};

export function toAddUnitPayload(values: AddUnitValues) {
  return {
    unitName: values.unitName.trim(),
    conversionFactor: values.conversionFactor,
    sellingPrice: values.sellingPrice ? values.sellingPrice : undefined,
  };
}
