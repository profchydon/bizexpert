import { Decimal } from '@prisma/client/runtime/library';

/** Coerce Prisma Decimal (or null) to number for business math. */
export function dec(value: Decimal | number | string | null | undefined): number {
  if (value == null) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value);
  return value.toNumber();
}
