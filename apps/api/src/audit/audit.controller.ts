import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { BusinessAccessGuard } from '../common/guards/business-access.guard';
import { AuditService } from './audit.service';

class AuditQueryDto {
  @IsOptional() @Type(() => Number) page?: number;
  @IsOptional() @Type(() => Number) limit?: number;
  @IsOptional() @IsString() entityType?: string;
}

@ApiTags('Audit')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessAccessGuard)
@Controller('businesses/:businessId/audit-logs')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  findAll(@Param('businessId') businessId: string, @Query() query: AuditQueryDto) {
    return this.auditService.findAll(businessId, query);
  }
}

