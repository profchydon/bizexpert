import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsPositive, IsOptional, IsString, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { BusinessAccessGuard } from '../common/guards/business-access.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { PurchaseStatus } from '../common/enums';
import { PurchasesService } from './purchases.service';

class PurchaseItemDto {
  @IsUUID() productId: string;
  @IsNumber() @IsPositive() @Type(() => Number) orderedQuantity: number;
  @IsNumber() @IsPositive() @Type(() => Number) unitCost: number;
}

class CreatePurchaseDto {
  @IsUUID() locationId: string;
  @IsOptional() @IsString() supplierName?: string;
  @IsOptional() @IsUUID() supplierId?: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => PurchaseItemDto) items: PurchaseItemDto[];
  @IsOptional() @IsString() expectedAt?: string;
  @IsOptional() @IsString() notes?: string;
}

class ReceiveItemDto {
  @IsUUID() purchaseItemId: string;
  @IsNumber() @IsPositive() @Type(() => Number) receivedQuantity: number;
  @IsOptional() @IsNumber() @IsPositive() @Type(() => Number) actualUnitCost?: number;
}

class ReceiveItemsDto {
  @IsArray() @ValidateNested({ each: true }) @Type(() => ReceiveItemDto) items: ReceiveItemDto[];
  @IsOptional() @IsString() notes?: string;
}

class PurchaseQueryDto {
  @IsOptional() @Type(() => Number) page?: number;
  @IsOptional() @Type(() => Number) limit?: number;
  @IsOptional() @IsUUID() locationId?: string;
  @IsOptional() @IsEnum(PurchaseStatus) status?: PurchaseStatus;
}

@ApiTags('Purchases')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessAccessGuard)
@Controller('businesses/:businessId/purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a purchase order' })
  create(
    @CurrentUser() user: User,
    @Param('businessId') businessId: string,
    @Body() dto: CreatePurchaseDto,
  ) {
    return this.purchasesService.create(businessId, dto.locationId, user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List purchase orders' })
  findAll(@Param('businessId') businessId: string, @Query() query: PurchaseQueryDto) {
    return this.purchasesService.findAll(businessId, query);
  }

  @Get(':id/grns')
  @ApiOperation({ summary: 'List goods receipt notes for a PO' })
  listGrns(@Param('businessId') businessId: string, @Param('id') id: string) {
    return this.purchasesService.listGrns(id, businessId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a purchase order' })
  findOne(@Param('businessId') businessId: string, @Param('id') id: string) {
    return this.purchasesService.findOne(id, businessId);
  }

  @Post(':id/receive')
  @ApiOperation({ summary: 'Receive items from a purchase order' })
  receiveItems(
    @CurrentUser() user: User,
    @Param('businessId') businessId: string,
    @Param('id') id: string,
    @Body() dto: ReceiveItemsDto,
  ) {
    return this.purchasesService.receiveItems(id, businessId, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cancel a purchase order' })
  cancel(@Param('businessId') businessId: string, @Param('id') id: string) {
    return this.purchasesService.cancel(id, businessId);
  }
}

