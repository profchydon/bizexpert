import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductCreateService } from './product-create.service';
import { ProductBulkService } from './product-bulk.service';

@Module({
  providers: [ProductsService, ProductCreateService, ProductBulkService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
