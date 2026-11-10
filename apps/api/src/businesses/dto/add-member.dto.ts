import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { BusinessRole } from "../../common/enums";

export class AddMemberDto {
  @ApiProperty({
    example: "staff@example.com",
    description: "Email of the user to add as a member",
  })
  @IsEmail()
  email: string;

  @ApiProperty({ enum: BusinessRole, example: BusinessRole.CASHIER })
  @IsEnum(BusinessRole)
  @IsNotEmpty()
  role: BusinessRole;
}
