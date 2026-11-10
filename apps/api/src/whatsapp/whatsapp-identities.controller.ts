import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from "class-validator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { BusinessAccessGuard } from "../common/guards/business-access.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { ROLES_THAT_CAN_MANAGE_SETTINGS } from "../common/role-access";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { User } from "../entities/user.entity";
import { WhatsappIdentitiesService } from "./whatsapp-identities.service";

class CreateWhatsappIdentityDto {
  @IsString()
  @Matches(/^\+[1-9]\d{6,14}$/, {
    message: "Phone must be E.164 format, e.g. +2348012345678",
  })
  whatsappPhone: string;

  @IsOptional()
  @IsUUID()
  defaultLocationId?: string;
}

class UpdateWhatsappIdentityDto {
  @IsOptional()
  @IsUUID()
  defaultLocationId?: string;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}

@ApiTags("WhatsApp Identities")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessAccessGuard)
@Controller("businesses/:businessId/whatsapp-identities")
export class WhatsappIdentitiesController {
  constructor(private readonly service: WhatsappIdentitiesService) {}

  @Get()
  @ApiOperation({ summary: "List WhatsApp identities for the business" })
  list(@Param("businessId") businessId: string) {
    return this.service.list(businessId);
  }

  @Post()
  @Roles(...ROLES_THAT_CAN_MANAGE_SETTINGS)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Link a WhatsApp phone number" })
  create(
    @CurrentUser() user: User,
    @Param("businessId") businessId: string,
    @Body() dto: CreateWhatsappIdentityDto,
  ) {
    return this.service.create(businessId, user.id, dto);
  }

  @Put(":id")
  @Roles(...ROLES_THAT_CAN_MANAGE_SETTINGS)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Update default location or verification (pilot)" })
  update(
    @Param("businessId") businessId: string,
    @Param("id") id: string,
    @Body() dto: UpdateWhatsappIdentityDto,
  ) {
    return this.service.update(businessId, id, dto);
  }

  @Delete(":id")
  @Roles(...ROLES_THAT_CAN_MANAGE_SETTINGS)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Remove a WhatsApp identity link" })
  remove(@Param("businessId") businessId: string, @Param("id") id: string) {
    return this.service.remove(businessId, id);
  }
}
