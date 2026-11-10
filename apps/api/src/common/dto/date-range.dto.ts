import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsOptional, IsUUID } from 'class-validator';

/**
 * Reusable date-range filter DTO.
 *
 * Used by analytics, sales, purchase, and other time-series endpoints to
 * narrow results to a specific date window and, optionally, a single location.
 */
export class DateRangeDto {
  @ApiPropertyOptional({
    description: 'Start of the date range (ISO 8601 date string)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End of the date range (ISO 8601 date string, inclusive)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Filter results to a specific business location',
    example: 'b3d9c1e2-4f5a-4b2c-9e8d-1a2b3c4d5e6f',
  })
  @IsOptional()
  @IsUUID('4')
  @Type(() => String)
  locationId?: string;
}
