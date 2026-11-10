import { Process, Processor } from '@nestjs/bull';
import { Logger, Inject, forwardRef } from '@nestjs/common';
import { Job } from 'bull';
import { WhatsappService, WhatsAppMessage } from './whatsapp.service';
import { WhatsappIdentitiesService } from './whatsapp-identities.service';
import { AiService } from '../ai/ai.service';

@Processor('whatsapp-messages')
export class WhatsappProcessor {
  private readonly logger = new Logger(WhatsappProcessor.name);

  constructor(
    private readonly whatsappService: WhatsappService,
    private readonly identitiesService: WhatsappIdentitiesService,
    @Inject(forwardRef(() => AiService))
    private readonly aiService: AiService,
  ) {}

  @Process('process-message')
  async handleMessage(job: Job<{ message: WhatsAppMessage }>) {
    const { message } = job.data;
    const phone = message.from;
    const text = message.text?.body ?? '';

    this.logger.log(`Processing WhatsApp message from ${phone}: ${text}`);

    try {
      const normalized = this.whatsappService.normalizePhone(phone);

      if (/^verify$/i.test(text.trim())) {
        const verified = await this.identitiesService.verifyByPhone(normalized);
        if (verified) {
          await this.whatsappService.sendMessage(
            phone,
            '✅ Your WhatsApp number is verified. You can now ask about sales, stock, or record transactions.',
          );
        } else {
          await this.whatsappService.sendMessage(
            phone,
            'Link this number in BizExpert Settings → WhatsApp first, then reply VERIFY.',
          );
        }
        return;
      }

      const identity = await this.whatsappService.findIdentityByPhone(normalized);

      if (!identity || !identity.isVerified) {
        await this.whatsappService.sendMessage(
          phone,
          '👋 Welcome to BizExpert! Your WhatsApp number is not linked to any account. ' +
            'Please visit your dashboard Settings → WhatsApp to connect this number.',
        );
        return;
      }

      // Delegate to AI service
      const reply = await this.aiService.handleWhatsAppMessage(
        identity.user,
        identity.business,
        phone,
        text,
        identity,
      );

      await this.whatsappService.sendMessage(phone, reply);
    } catch (err: any) {
      this.logger.error(`Error processing WhatsApp message from ${phone}: ${err.message}`, err.stack);
      await this.whatsappService.sendMessage(
        phone,
        '⚠️ Sorry, something went wrong processing your request. Please try again.',
      );
    }
  }
}

