import { Module, forwardRef } from '@nestjs/common';
import { PendingActionsService } from './pending-actions.service';
import { PendingActionsScheduler } from './pending-actions.scheduler';
import { SalesModule } from '../sales/sales.module';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [
    forwardRef(() => SalesModule),
    forwardRef(() => InventoryModule),
  ],
  providers: [PendingActionsService, PendingActionsScheduler],
  exports: [PendingActionsService],
})
export class PendingActionsModule {}
