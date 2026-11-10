import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ProductKind } from '@prisma/client';

export class ProductOpeningStockDto {
  @IsUUID()
  locationId: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  quantity: number;
}

export class ProductVariantInputDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  sku?: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  barcode?: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  sellingPrice: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  purchaseCost: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOpeningStockDto)
  openingStock?: ProductOpeningStockDto[];
}

export class CreateProductFullDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ enum: ProductKind, default: ProductKind.product })
  @IsOptional()
  @IsEnum(ProductKind)
  kind?: ProductKind;

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
  @IsUrl()
  @MaxLength(500)
  imageUrl?: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsUUID(undefined, { each: true })
  locationIds: string[];

  @IsBoolean()
  hasVariants: boolean;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  sellingPrice?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  purchaseCost?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  lowStockThreshold?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOpeningStockDto)
  openingStock?: ProductOpeningStockDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantInputDto)
  variants?: ProductVariantInputDto[];
}
