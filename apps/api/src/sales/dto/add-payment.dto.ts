import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { PaymentMethod } from '../../common/enums';

export class AddPaymentDto {
  @ApiProperty({ description: 'Payment amount (NGN)', minimum: 0.01 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ enum: PaymentMethod, description: 'Payment method used' })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  method: PaymentMethod;

  @ApiPropertyOptional({ description: 'External payment reference (optional)' })
  @IsOptional()
  @IsString()
  reference?: string;
}
