import { z } from "zod";

export const employeeSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  level: z.string(),
  role: z.string(),
  department: z.string(),
  email: z.string(),
  phone: z.string(),
  address: z.string(),
});

export type Task = z.infer<typeof employeeSchema>;
