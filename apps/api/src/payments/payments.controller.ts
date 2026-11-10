import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { BusinessAccessGuard } from "../common/guards/business-access.guard";
import { PaymentMethod } from "../common/enums";
import { PaymentsService } from "./payments.service";

class PaymentQueryDto {
  @IsOptional() @Type(() => Number) page?: number;
  @IsOptional() @Type(() => Number) limit?: number;
  @IsOptional() @IsUUID() locationId?: string;
  @IsOptional() @IsString() startDate?: string;
  @IsOptional() @IsString() endDate?: string;
  @IsOptional() @IsEnum(PaymentMethod) method?: PaymentMethod;
}

@ApiTags("Payments")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessAccessGuard)
@Controller("businesses/:businessId/payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  findAll(
    @Param("businessId") businessId: string,
    @Query() query: PaymentQueryDto,
  ) {
    return this.paymentsService.findAll(businessId, query);
  }
}
