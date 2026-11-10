import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PendingActionsService } from './pending-actions.service';

@Injectable()
export class PendingActionsScheduler {
  private readonly logger = new Logger(PendingActionsScheduler.name);

  constructor(private readonly pendingActionsService: PendingActionsService) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async expireStaleActions(): Promise<void> {
    await this.pendingActionsService.expireOldActions();
    this.logger.debug('Expired stale pending WhatsApp actions');
  }
}
