import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'chidi@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secureP@ssw0rd' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
