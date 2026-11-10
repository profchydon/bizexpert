import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappProcessor } from './whatsapp.processor';
import { WhatsappIdentitiesController } from './whatsapp-identities.controller';
import { WhatsappIdentitiesService } from './whatsapp-identities.service';
import { AiModule } from '../ai/ai.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'whatsapp-messages' }),
    forwardRef(() => AiModule),
    AuditModule,
  ],
  providers: [WhatsappService, WhatsappProcessor, WhatsappIdentitiesService],
  controllers: [WhatsappController, WhatsappIdentitiesController],
  exports: [WhatsappService, WhatsappIdentitiesService],
})
export class WhatsappModule {}
