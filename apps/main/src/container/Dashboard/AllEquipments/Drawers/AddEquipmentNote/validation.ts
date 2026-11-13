import { z } from "zod";

export const addEquipmentNoteSchema = z.object({
  note: z.unknown().optional(),
});
