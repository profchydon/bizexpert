import { z } from "zod";

export const createDepartmentSchema = z.object({
  department_name: z.string().min(2, { message: "Department is required" }),
  add_members: z.string().min(2).optional(),
});

export const moveDepartmentSchema = z.object({
  current_department: z.string().optional(),
  new_department: z.string().min(2, { message: "New department is required" }),
  add_members: z.string().optional(),
});
