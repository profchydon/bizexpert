import { z } from "zod";

export const addDocumentSchema = z.object({
  document_name: z.string().min(2, { message: "Name is required" }),
  add_members: z.string().min(2).optional(),
});
