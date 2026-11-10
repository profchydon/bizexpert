import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { PaymentMethod } from '../../common/enums';

export class SaleItemDto {
  @ApiProperty({ description: 'Product UUID' })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Quantity in the selling unit', minimum: 0.0001 })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiPropertyOptional({
    description:
      "Selling unit name (e.g. 'carton', 'piece'). Defaults to product base unit if omitted.",
  })
  @IsOptional()
  @IsString()
  unitName?: string;

  @ApiPropertyOptional({
    description:
      'Override unit selling price (NGN). Defaults to product.sellingPrice if omitted.',
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  unitPrice?: number;

  @ApiPropertyOptional({ description: 'Line-level discount amount (NGN)', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountAmount?: number;
}

export class CreateSaleDto {
  @ApiProperty({ description: 'Location UUID where the sale occurs' })
  @IsUUID()
  @IsNotEmpty()
  locationId: string;

  @ApiProperty({ type: [SaleItemDto], description: 'List of items in this sale' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[];

  @ApiPropertyOptional({ description: 'Existing customer UUID' })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiPropertyOptional({ description: 'Walk-in or named customer' })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({
    enum: PaymentMethod,
    description: 'Payment method. If omitted the sale is recorded as credit.',
  })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional({ description: 'External payment reference (bank ref, POS ref, etc.)' })
  @IsOptional()
  @IsString()
  paymentReference?: string;

  @ApiPropertyOptional({ description: 'Optional sale-level notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Sale-level discount applied after line totals (NGN)', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountAmount?: number;
}
