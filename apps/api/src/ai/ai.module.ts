import { Module, forwardRef } from "@nestjs/common";
import { AiService } from "./ai.service";
import { AiController } from "./ai.controller";
import { WhatsappModule } from "../whatsapp/whatsapp.module";
import { AnalyticsModule } from "../analytics/analytics.module";
import { PendingActionsModule } from "../pending-actions/pending-actions.module";
import { InventoryModule } from "../inventory/inventory.module";

@Module({
  imports: [
    forwardRef(() => WhatsappModule),
    AnalyticsModule,
    PendingActionsModule,
    InventoryModule,
  ],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
