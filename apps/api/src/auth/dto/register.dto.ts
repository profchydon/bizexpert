import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Chidi Okeke', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'chidi@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secureP@ssw0rd', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ example: '+2348012345678', description: 'Phone number (optional)' })
  @IsOptional()
  @IsString()
  phone?: string;
}
