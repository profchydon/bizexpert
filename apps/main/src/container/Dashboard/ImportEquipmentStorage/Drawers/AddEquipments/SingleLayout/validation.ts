import { z } from "zod";

export const addSingleLayoutSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title is required" })
    .max(60, { message: "Title must be 60 characters or less" }),
  serial_number: z.unknown().optional(),
  make: z.unknown().optional(),
  model: z.unknown().optional(),
  year: z.unknown().optional(),
  type: z.string().min(2, { message: "Equipment type is required" }),
  state: z.string().min(2, { message: "Equipment state is required" }),
  country: z.string().optional(),
  assignee: z.unknown().optional(),
  details: z.unknown().optional(),
  storage_duration: z.unknown().optional(),
  collection_date: z.unknown().optional(),
  image: z.unknown().optional(),
  description: z.unknown().optional(),
});
