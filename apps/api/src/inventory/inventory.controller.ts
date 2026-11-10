import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsPositive, IsOptional, IsString, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { BusinessAccessGuard } from '../common/guards/business-access.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, Role } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { StockMovementType } from '../common/enums';
import { InventoryService } from './inventory.service';

class OpeningStockDto {
  @IsUUID() locationId: string;
  @IsUUID() productId: string;
  @IsNumber() @IsPositive() @Type(() => Number) quantity: number;
  @IsNumber() @IsPositive() @Type(() => Number) unitCost: number;
}

class ReceiveStockDto {
  @IsUUID() locationId: string;
  @IsUUID() productId: string;
  @IsNumber() @IsPositive() @Type(() => Number) quantity: number;
  @IsNumber() @IsPositive() @Type(() => Number) unitCost: number;
  @IsOptional() @IsString() notes?: string;
}

class AdjustStockDto {
  @IsUUID() locationId: string;
  @IsUUID() productId: string;
  @IsNumber() @Type(() => Number) quantity: number;
  @IsString() reason: string;
  @IsOptional() @IsEnum(StockMovementType) movementType?: StockMovementType;
}

class TransferItemDto {
  @IsUUID() productId: string;
  @IsNumber() @IsPositive() @Type(() => Number) quantity: number;
}

class TransferStockDto {
  @IsUUID() sourceLocationId: string;
  @IsUUID() destinationLocationId: string;
  items: TransferItemDto[];
  @IsOptional() @IsString() notes?: string;
  /** When true, completes in one step (legacy). Default: in-transit dispatch. */
  @IsOptional() immediate?: boolean;
}

class ReceiveTransferDto {
  @IsOptional()
  items?: Array<{ productId: string; quantity: number }>;
}

class MovementQueryDto {
  @IsOptional() @IsUUID() locationId?: string;
  @IsOptional() @IsUUID() productId?: string;
  @IsOptional() @IsString() type?: string;
  @IsOptional() @IsString() startDate?: string;
  @IsOptional() @IsString() endDate?: string;
  @IsOptional() @Type(() => Number) @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @Min(1) limit?: number;
}

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessAccessGuard)
@Controller('businesses/:businessId/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('opening-stock')
  @ApiOperation({ summary: 'Set opening stock for a product at a location' })
  setOpeningStock(
    @CurrentUser() user: User,
    @Param('businessId') businessId: string,
    @Body() dto: OpeningStockDto,
  ) {
    return this.inventoryService.setOpeningStock(businessId, dto.locationId, user.id, dto);
  }

  @Post('receive')
  @ApiOperation({ summary: 'Receive new stock' })
  receiveStock(
    @CurrentUser() user: User,
    @Param('businessId') businessId: string,
    @Body() dto: ReceiveStockDto,
  ) {
    return this.inventoryService.receiveStock(businessId, dto.locationId, user.id, dto);
  }

  @Post('adjust')
  @ApiOperation({ summary: 'Adjust stock quantity' })
  adjustStock(
    @CurrentUser() user: User,
    @Param('businessId') businessId: string,
    @Body() dto: AdjustStockDto,
  ) {
    return this.inventoryService.adjustStock(businessId, dto.locationId, user.id, dto);
  }

  @Post('transfer')
  @ApiOperation({ summary: 'Dispatch stock transfer (in-transit by default)' })
  transferStock(
    @CurrentUser() user: User,
    @Param('businessId') businessId: string,
    @Body() dto: TransferStockDto,
  ) {
    return this.inventoryService.transferStock(businessId, user.id, dto);
  }

  @Get('transfers')
  @ApiOperation({ summary: 'List stock transfers' })
  listTransfers(
    @Param('businessId') businessId: string,
    @Query('status') status?: string,
  ) {
    return this.inventoryService.listTransfers(businessId, status);
  }

  @Post('transfers/:transferId/receive')
  @ApiOperation({ summary: 'Receive in-transit transfer at destination' })
  receiveTransfer(
    @CurrentUser() user: User,
    @Param('businessId') businessId: string,
    @Param('transferId') transferId: string,
    @Body() dto: ReceiveTransferDto,
  ) {
    return this.inventoryService.receiveTransfer(businessId, user.id, transferId, dto);
  }

  @Post('transfers/:transferId/cancel')
  @ApiOperation({ summary: 'Cancel in-transit transfer and restore source stock' })
  cancelTransfer(
    @CurrentUser() user: User,
    @Param('businessId') businessId: string,
    @Param('transferId') transferId: string,
  ) {
    return this.inventoryService.cancelInTransitTransfer(businessId, user.id, transferId);
  }

  @Get('balances')
  @ApiOperation({ summary: 'Get inventory balances' })
  getBalances(
    @Param('businessId') businessId: string,
    @Query('locationId') locationId?: string,
  ) {
    return this.inventoryService.getLocationBalances(businessId, locationId);
  }

  @Get('movements')
  @ApiOperation({ summary: 'Get stock movement history' })
  getMovements(
    @Param('businessId') businessId: string,
    @Query() query: MovementQueryDto,
  ) {
    return this.inventoryService.getMovementHistory(businessId, query);
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get low stock alerts' })
  getLowStock(
    @Param('businessId') businessId: string,
    @Query('locationId') locationId?: string,
  ) {
    return this.inventoryService.getLowStockProducts(businessId, locationId);
  }
}

