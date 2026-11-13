import { z } from "zod";

export const setupFormSchema = z.object({
  domain_ip: z.string().min(2, { message: "Domain Controller IP is required" }),
  domain_name: z.string().min(2, { message: "Domain Name is required" }),
  username: z.string().min(2, { message: "Username is required" }),
  password: z.string().min(2, { message: "Password is required" }),
  ldap_port: z.string().min(2, { message: "LDAP Port is required" }),
});
