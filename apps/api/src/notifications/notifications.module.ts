import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [WhatsappModule, AnalyticsModule],
  providers: [NotificationsService],
})
export class NotificationsModule {}
