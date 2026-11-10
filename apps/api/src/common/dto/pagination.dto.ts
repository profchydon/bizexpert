import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  IsIn,
  Min,
  Max,
} from 'class-validator';

export type SortOrder = 'ASC' | 'DESC';

/**
 * Generic pagination DTO used as a query parameter bag for list endpoints.
 *
 * All properties are optional with sensible defaults:
 *   page=1, limit=20, sortOrder=DESC
 */
export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Page number (1-indexed)',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Field name to sort by (entity-specific)',
    example: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort direction',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: SortOrder = 'DESC';

  /** Computed offset for TypeORM / raw SQL OFFSET. */
  get offset(): number {
    return ((this.page ?? 1) - 1) * (this.limit ?? 20);
  }
}

/** Wrapper type returned from paginated service methods. */
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/** Helper to construct a PaginatedResult from raw data + count. */
export function paginate<T>(
  data: T[],
  total: number,
  dto: PaginationDto,
): PaginatedResult<T> {
  const page = dto.page ?? 1;
  const limit = dto.limit ?? 20;
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}
