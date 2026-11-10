import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsUUID } from 'class-validator';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { BusinessAccessGuard } from '../common/guards/business-access.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

import { LocationsService } from './locations.service';
import { CreateLocationDto } from './create-location.dto';

class AssignStaffDto {
  @IsUUID() userId: string;
  @IsOptional() @IsBoolean() canSell?: boolean;
  @IsOptional() @IsBoolean() canReceiveStock?: boolean;
  @IsOptional() @IsBoolean() canTransferStock?: boolean;
  @IsOptional() @IsBoolean() canViewAnalytics?: boolean;
}

@ApiTags('Locations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessAccessGuard)
@Controller('businesses/:businessId/locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  create(
    @CurrentUser() user: User,
    @Param('businessId') businessId: string,
    @Body() dto: CreateLocationDto,
  ) {
    return this.locationsService.create(businessId, user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: User, @Param('businessId') businessId: string) {
    return this.locationsService.findAll(businessId, user.id);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: User,
    @Param('businessId') businessId: string,
    @Param('id') id: string,
  ) {
    return this.locationsService.findOne(id, businessId, user.id);
  }

  @Put(':id')
  update(
    @CurrentUser() user: User,
    @Param('businessId') businessId: string,
    @Param('id') id: string,
    @Body() dto: Partial<CreateLocationDto>,
  ) {
    return this.locationsService.update(id, businessId, user.id, dto as any);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deactivate(
    @CurrentUser() user: User,
    @Param('businessId') businessId: string,
    @Param('id') id: string,
  ) {
    return this.locationsService.deactivate(id, businessId, user.id);
  }

  @Post(':id/set-default')
  setDefault(
    @CurrentUser() user: User,
    @Param('businessId') businessId: string,
    @Param('id') id: string,
  ) {
    return this.locationsService.setDefault(id, businessId, user.id);
  }

  @Get(':id/staff')
  getStaff(@Param('id') id: string) {
    return this.locationsService.getStaff(id);
  }

  @Post(':id/staff')
  assignStaff(
    @Param('businessId') businessId: string,
    @Param('id') id: string,
    @Body() dto: AssignStaffDto,
  ) {
    return this.locationsService.assignStaff(id, businessId, dto);
  }

  @Put(':id/staff/:memberId')
  updateStaff(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body() dto: Partial<AssignStaffDto>,
  ) {
    return this.locationsService.updateStaffPermissions(id, memberId, dto as any);
  }

  @Delete(':id/staff/:memberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeStaff(@Param('id') id: string, @Param('memberId') memberId: string) {
    return this.locationsService.removeStaff(id, memberId);
  }
}

