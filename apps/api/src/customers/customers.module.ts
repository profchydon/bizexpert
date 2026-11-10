import { Module } from '@nestjs/common';
import { CustomersAccountService } from './customers-account.service';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';

@Module({
  providers: [CustomersService, CustomersAccountService],
  controllers: [CustomersController],
  exports: [CustomersService, CustomersAccountService],
})
export class CustomersModule {}
