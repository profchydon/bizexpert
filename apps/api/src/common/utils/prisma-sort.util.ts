import type { Prisma } from '@prisma/client';

import type { SortOrder } from '../dto/pagination.dto';

export function toPrismaSortOrder(sortOrder?: SortOrder): Prisma.SortOrder {
  return sortOrder === 'ASC' ? 'asc' : 'desc';
}
