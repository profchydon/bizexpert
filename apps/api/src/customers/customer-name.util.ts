export function normalizeCustomerName(name: string): string {
  return name.trim();
}

export function normalizeCustomerPhone(phone?: string | null): string | null {
  const next = phone?.trim();
  return next ? next : null;
}

export function phonesMatch(
  left?: string | null,
  right?: string | null,
): boolean {
  const a = normalizeCustomerPhone(left);
  const b = normalizeCustomerPhone(right);
  if (!a || !b) return false;
  return a === b;
}

export function findPhoneConflict<T extends { id: string; phone?: string | null }>(
  existing: T[],
  phone: string | null,
  excludeId?: string,
): T | undefined {
  if (!phone) return undefined;
  return existing.find(
    (row) => row.id !== excludeId && phonesMatch(row.phone, phone),
  );
}
