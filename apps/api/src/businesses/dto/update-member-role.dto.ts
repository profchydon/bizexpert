import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { BusinessRole } from "../../common/enums";

export class UpdateMemberRoleDto {
  @ApiProperty({ enum: BusinessRole, example: BusinessRole.ADMIN })
  @IsEnum(BusinessRole)
  @IsNotEmpty()
  role: BusinessRole;
}
