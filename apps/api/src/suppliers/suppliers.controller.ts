import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { BusinessAccessGuard } from '../common/guards/business-access.guard';
import { SuppliersService } from './suppliers.service';

@ApiTags('Suppliers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessAccessGuard)
@Controller('businesses/:businessId/suppliers')
export class SuppliersController {
  constructor(private readonly service: SuppliersService) {}

  @Get()
  list(@Param('businessId') businessId: string) {
    return this.service.findAll(businessId);
  }

  @Post()
  create(@Param('businessId') businessId: string, @Body() body: Record<string, string>) {
    return this.service.create(businessId, body as any);
  }

  @Put(':id')
  update(
    @Param('businessId') businessId: string,
    @Param('id') id: string,
    @Body() body: Record<string, string>,
  ) {
    return this.service.update(id, businessId, body);
  }

  @Delete(':id')
  deactivate(@Param('businessId') businessId: string, @Param('id') id: string) {
    return this.service.deactivate(id, businessId);
  }
}
