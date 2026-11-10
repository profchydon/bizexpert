import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { startOfDay, endOfDay } from 'date-fns';
import { BusinessRole } from '../common/enums';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { formatNGN } from '../common/utils/decimal.util';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsappService: WhatsappService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_6PM)
  async sendDailySalesDigest(): Promise<void> {
    const identities = await this.prisma.whatsappIdentity.findMany({
      where: { isVerified: true },
    });
    const today = {
      startDate: startOfDay(new Date()).toISOString(),
      endDate: endOfDay(new Date()).toISOString(),
    };

    for (const identity of identities) {
      try {
        const summary = await this.analyticsService.getSalesSummary(identity.businessId, today);
        const cash = await this.analyticsService.getCollectionSummary(identity.businessId, today);
        const msg =
          `📊 BizExpert daily summary\n` +
          `Sales: ${formatNGN(summary.totalRevenue)} (${summary.completedSalesCount} orders)\n` +
          `Cash collected: ${formatNGN(cash.cashCollected)}\n` +
          `Outstanding credit: ${formatNGN(cash.outstandingCredit)}`;
        await this.whatsappService.sendMessage(
          identity.whatsappPhone.replace('+', ''),
          msg,
        );
      } catch (err: any) {
        this.logger.warn(`Digest failed for ${identity.whatsappPhone}: ${err.message}`);
      }
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendLowStockAlerts(): Promise<void> {
    const owners = await this.prisma.businessMembership.findMany({
      where: { role: BusinessRole.OWNER, isActive: true },
    });
    const businessIds = [...new Set(owners.map((o) => o.businessId))];

    for (const businessId of businessIds) {
      const identity = await this.prisma.whatsappIdentity.findFirst({
        where: { businessId, isVerified: true },
      });
      if (!identity) continue;

      const alerts = await this.analyticsService.getLowStockAlerts(businessId);
      if (!alerts.length) continue;

      const lines = alerts.slice(0, 10).map(
        (a: Record<string, string>) =>
          `• ${a.productName} @ ${a.locationName}: ${a.currentStock} (≤ ${a.threshold})`,
      );
      await this.whatsappService.sendMessage(
        identity.whatsappPhone.replace('+', ''),
        `⚠️ Low stock alert\n${lines.join('\n')}`,
      );
    }
  }
}
