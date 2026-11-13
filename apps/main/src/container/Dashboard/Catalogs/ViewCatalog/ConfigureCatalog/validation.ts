import { z } from "zod";

export const configureCatalogSchema = z.object({
  macbook: z.string().min(1, { message: "Macbook quantity is required" }),
  imac: z.string().min(1, { message: "IMAC quantity is required" }),
  laptop: z.string().min(1, { message: "Laptop quantity is required" }),
  workstation: z
    .string()
    .min(1, { message: "Workstation quantity is required" }),
  monitor: z.string().min(1, { message: "Monitor quantity is required" }),
  machinery: z.string().min(1, { message: "Machinery quantity is required" }),
  computer: z.string().min(1, { message: "Computer quantity is required" }),
  printer: z.string().min(1, { message: "Pricing quantity is required" }),
});
