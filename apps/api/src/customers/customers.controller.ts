import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { BusinessAccessGuard } from '../common/guards/business-access.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { CustomersAccountService } from './customers-account.service';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto } from './create-customer.dto';
import { CustomerLedgerEntryDto } from './customer-ledger.dto';

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessAccessGuard)
@Controller('businesses/:businessId/customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly accountService: CustomersAccountService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a customer' })
  create(
    @CurrentUser() user: User,
    @Param('businessId') businessId: string,
    @Body() dto: CreateCustomerDto,
  ) {
    return this.customersService.create(businessId, user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List customers' })
  findAll(
    @CurrentUser() user: User,
    @Param('businessId') businessId: string,
    @Query('search') search?: string,
  ) {
    return this.customersService.findAll(businessId, user.id, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a customer with sales and ledger' })
  findOne(
    @CurrentUser() user: User,
    @Param('businessId') businessId: string,
    @Param('id') id: string,
  ) {
    return this.customersService.findOne(id, businessId, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a customer' })
  update(
    @CurrentUser() user: User,
    @Param('businessId') businessId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.accountService.update(id, businessId, user.id, dto);
  }

  @Post(':id/ledger')
  @ApiOperation({ summary: 'Record wallet, debt, repayment, or write-off' })
  applyLedger(
    @CurrentUser() user: User,
    @Param('businessId') businessId: string,
    @Param('id') id: string,
    @Body() dto: CustomerLedgerEntryDto,
  ) {
    return this.accountService.applyLedger(id, businessId, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deactivate a customer' })
  remove(
    @CurrentUser() user: User,
    @Param('businessId') businessId: string,
    @Param('id') id: string,
  ) {
    return this.accountService.deactivate(id, businessId, user.id);
  }
}
