import { Module } from '@nestjs/common';
import { StocktakesService } from './stocktakes.service';
import { StocktakesController } from './stocktakes.controller';
import { InventoryModule } from '../inventory/inventory.module';
import { AuditModule } from '../audit/audit.module';
import { MembershipsModule } from '../memberships/memberships.module';

@Module({
  imports: [InventoryModule, AuditModule, MembershipsModule],
  providers: [StocktakesService],
  controllers: [StocktakesController],
})
export class StocktakesModule {}
