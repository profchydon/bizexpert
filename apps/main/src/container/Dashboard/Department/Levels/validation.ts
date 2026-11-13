import { z } from "zod";

export const createLevelSchema = z.object({
  level_name: z.string().min(2, { message: "Level is required" }),
  members: z.string().min(2).optional(),
});
