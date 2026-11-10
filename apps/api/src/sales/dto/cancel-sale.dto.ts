import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CancelSaleDto {
  @ApiProperty({ description: 'Reason for cancelling this sale (required)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  reason: string;
}
