import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive, IsOptional, MaxLength } from 'class-validator';

export class CreateProductUnitDto {
  @ApiProperty({
    description: 'Name of the alternative unit',
    example: 'carton',
  })
  @IsString()
  @MaxLength(100)
  unitName: string;

  @ApiProperty({
    description: 'Number of base units that make up one unit of this type',
    example: 12,
  })
  @IsNumber()
  @IsPositive()
  conversionFactor: number;

  @ApiPropertyOptional({
    description:
      'Override selling price for this unit. If omitted, price = product.sellingPrice × conversionFactor.',
    example: 1650,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  sellingPrice?: number;
}
