import { IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CustomerLedgerType } from '@prisma/client';

export class CustomerLedgerEntryDto {
  @IsEnum(CustomerLedgerType)
  type: CustomerLedgerType;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  amount: number;

  @IsOptional()
  @IsString()
  note?: string;
}
