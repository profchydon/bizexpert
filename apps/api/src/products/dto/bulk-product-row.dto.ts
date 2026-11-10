import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ProductKind } from '@prisma/client';

export class BulkProductRowDto {
  @IsString()
  @MinLength(1)
  locationName: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  subCategory?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  sku?: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  barcode?: string;

  @IsString()
  @MaxLength(50)
  baseUnit: string;

  @IsOptional()
  @IsEnum(ProductKind)
  kind?: ProductKind;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  sellingPrice: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  purchaseCost: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  openingQuantity?: number;
}
