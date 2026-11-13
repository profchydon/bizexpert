import { z } from "zod";

export const allEquipmentsSchema = z.object({
  id: z.string(),
  equipment_image: z.any(),
  equipment_name: z.string(),
  equipment_type: z.string(),
  assignee: z.string(),
  serial_number: z.string(),
  purchase_date: z.string(),
  status: z.string(),
});

export type Task = z.infer<typeof allEquipmentsSchema>;
