import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { SaleStatus, SaleSource } from '../../common/enums';

export class SaleQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by location UUID' })
  @IsOptional()
  @IsUUID()
  locationId?: string;

  @ApiPropertyOptional({ enum: SaleStatus, description: 'Filter by sale status' })
  @IsOptional()
  @IsEnum(SaleStatus)
  status?: SaleStatus;

  @ApiPropertyOptional({ enum: SaleSource, description: 'Filter by sale source' })
  @IsOptional()
  @IsEnum(SaleSource)
  source?: SaleSource;

  @ApiPropertyOptional({ description: 'Filter sales on or after this ISO date' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Filter sales on or before this ISO date' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Filter by customer UUID' })
  @IsOptional()
  @IsUUID()
  customerId?: string;
}
