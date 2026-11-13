import { z } from "zod";

export const AddCartSchema = z.object({
  asset_id: z.string(),
  name: z.string(),
  asset_name: z.string(),
  asset_quantity: z.number(),
  asset_type: z.string(),
  asset_price: z.number(),
  asset_img: z.string(),
});

export type Task = z.infer<typeof AddCartSchema>;
