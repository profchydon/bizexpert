import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { BusinessAccessGuard } from '../common/guards/business-access.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { StocktakesService } from './stocktakes.service';

class CountLineDto {
  @IsUUID() lineId: string;
  @IsNumber() @Type(() => Number) countedQuantity: number;
}

class UpdateCountsDto {
  @IsArray() @ValidateNested({ each: true }) @Type(() => CountLineDto)
  lines: CountLineDto[];
}

@ApiTags('Stocktakes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessAccessGuard)
@Controller('businesses/:businessId/stocktakes')
export class StocktakesController {
  constructor(private readonly service: StocktakesService) {}

  @Post()
  @ApiOperation({ summary: 'Start a guided stock count at a location' })
  create(
    @CurrentUser() user: User,
    @Param('businessId') businessId: string,
    @Body() body: { locationId: string; notes?: string },
  ) {
    return this.service.create(businessId, user.id, body.locationId, body.notes);
  }

  @Get()
  list(@Param('businessId') businessId: string, @Query('locationId') locationId?: string) {
    return this.service.findAll(businessId, locationId);
  }

  @Get(':id')
  getOne(@Param('businessId') businessId: string, @Param('id') id: string) {
    return this.service.findOne(id, businessId);
  }

  @Put(':id/counts')
  updateCounts(
    @CurrentUser() user: User,
    @Param('businessId') businessId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCountsDto,
  ) {
    return this.service.updateCounts(id, businessId, user.id, dto.lines);
  }

  @Post(':id/submit')
  submit(
    @CurrentUser() user: User,
    @Param('businessId') businessId: string,
    @Param('id') id: string,
  ) {
    return this.service.submitForApproval(id, businessId, user.id);
  }

  @Post(':id/approve')
  approve(
    @CurrentUser() user: User,
    @Param('businessId') businessId: string,
    @Param('id') id: string,
  ) {
    return this.service.approve(id, businessId, user.id);
  }

  @Post(':id/reject')
  reject(
    @CurrentUser() user: User,
    @Param('businessId') businessId: string,
    @Param('id') id: string,
  ) {
    return this.service.reject(id, businessId, user.id);
  }
}
