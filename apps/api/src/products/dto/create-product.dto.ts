import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsPositive,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Product name', example: 'Indomie Noodles 70g' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ description: 'Stock-keeping unit code', example: 'INDO-70G' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sku?: string;

  @ApiPropertyOptional({ description: 'Barcode / QR payload for scanning', example: '8901234567890' })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  barcode?: string;

  @ApiPropertyOptional({ description: 'Product category', example: 'Food & Beverages' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiPropertyOptional({ description: 'Product sub-category', example: 'Soft drinks' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  subCategory?: string;

  @ApiPropertyOptional({ description: 'Detailed product description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Default retail selling price (NGN)', example: 150 })
  @IsNumber()
  @IsPositive()
  sellingPrice: number;

  @ApiProperty({ description: 'Default purchase / cost price (NGN)', example: 110 })
  @IsNumber()
  @IsPositive()
  purchaseCost: number;

  @ApiPropertyOptional({
    description: 'Name of the base unit (singular)',
    example: 'piece',
    default: 'piece',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  baseUnit?: string = 'piece';

  @ApiPropertyOptional({ description: 'Public URL for the product image' })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Low-stock alert threshold in base units',
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  lowStockThreshold?: number;
}
