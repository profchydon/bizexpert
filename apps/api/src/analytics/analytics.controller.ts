import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import {
  IsOptional,
  IsUUID,
  IsString,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { BusinessAccessGuard } from '../common/guards/business-access.guard';
import { AnalyticsService } from './analytics.service';

class AnalyticsQueryDto {
  @IsOptional() @IsUUID() locationId?: string;
  @IsOptional() @IsString() startDate?: string;
  @IsOptional() @IsString() endDate?: string;
  @IsOptional() @Type(() => Number) @IsNumber() limit?: number;
}

class PeriodQueryDto extends AnalyticsQueryDto {
  @IsOptional() @IsEnum(['day', 'week', 'month']) groupBy?:
    'day' | 'week' | 'month';
}

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessAccessGuard)
@Controller('businesses/:businessId/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('sales-summary')
  @ApiOperation({ summary: 'Sales revenue, profit, and count for a period' })
  getSalesSummary(
    @Param('businessId') businessId: string,
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getSalesSummary(businessId, query);
  }

  @Get('collection-summary')
  @ApiOperation({ summary: 'Revenue vs cash collected vs outstanding credit' })
  getCollectionSummary(
    @Param('businessId') businessId: string,
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getCollectionSummary(businessId, query);
  }

  @Get('cashflow')
  @ApiOperation({ summary: 'Payment inflows vs purchase outflows by day' })
  getCashflow(
    @Param('businessId') businessId: string,
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getCashflow(businessId, query);
  }

  @Get('customers')
  @ApiOperation({ summary: 'New, returning, average spend, and top customers' })
  getCustomerAnalytics(
    @Param('businessId') businessId: string,
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getCustomerAnalytics(businessId, query);
  }

  @Get('sales-by-period')
  @ApiOperation({ summary: 'Time-series sales data for charts' })
  getSalesByPeriod(
    @Param('businessId') businessId: string,
    @Query() query: PeriodQueryDto,
  ) {
    return this.analyticsService.getSalesByPeriod(
      businessId,
      query,
      query.groupBy ?? 'day',
    );
  }

  @Get('top-products')
  @ApiOperation({ summary: 'Best-selling products by revenue' })
  getTopProducts(
    @Param('businessId') businessId: string,
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getTopProducts(businessId, query);
  }

  @Get('slow-moving')
  @ApiOperation({ summary: 'Slow-moving products' })
  getSlowMoving(
    @Param('businessId') businessId: string,
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getSlowMovingProducts(businessId, query);
  }

  @Get('inventory-valuation')
  @ApiOperation({ summary: 'Inventory valuation at weighted-average cost' })
  getInventoryValuation(
    @Param('businessId') businessId: string,
    @Query('locationId') locationId?: string,
  ) {
    return this.analyticsService.getInventoryValuation(businessId, locationId);
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Products at or below low-stock threshold' })
  getLowStockAlerts(
    @Param('businessId') businessId: string,
    @Query('locationId') locationId?: string,
  ) {
    return this.analyticsService.getLowStockAlerts(businessId, locationId);
  }

  @Get('locations')
  @ApiOperation({ summary: 'Performance comparison across locations' })
  getLocationComparison(
    @Param('businessId') businessId: string,
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getLocationComparison(businessId, query);
  }
}
