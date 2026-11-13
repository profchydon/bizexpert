import type { Customer } from "@/types/bizexpert";

export function filterCustomersBySearch(
  customers: Customer[],
  query: string,
): Customer[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return customers;
  return customers.filter((row) => {
    const fields = [row.name, row.phone, row.email, row.address];
    return fields.some((value) => value?.toLowerCase().includes(needle));
  });
}
