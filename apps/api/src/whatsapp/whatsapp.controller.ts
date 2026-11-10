import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import { WhatsappService, WhatsAppWebhookPayload } from './whatsapp.service';

@ApiTags('WhatsApp')
@Controller('whatsapp')
export class WhatsappController {
  private readonly logger = new Logger(WhatsappController.name);

  constructor(
    private readonly whatsappService: WhatsappService,
    private readonly configService: ConfigService,
    @InjectQueue('whatsapp-messages') private readonly messageQueue: Queue,
  ) {}

  /**
   * GET /api/v1/whatsapp/webhook
   * Meta webhook verification handshake.
   */
  @Get('webhook')
  @ApiExcludeEndpoint()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response,
  ) {
    const expected = this.configService.get<string>('WHATSAPP_VERIFY_TOKEN');
    if (mode === 'subscribe' && token === expected) {
      this.logger.log('WhatsApp webhook verified');
      return res.status(200).send(challenge);
    }
    return res.status(403).send('Forbidden');
  }

  /**
   * POST /api/v1/whatsapp/webhook
   * Receives incoming WhatsApp messages.
   * Must respond 200 immediately; processing happens in the queue.
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Receive WhatsApp webhook events' })
  async receiveWebhook(
    @Req() req: Request & { rawBody?: Buffer },
    @Body() payload: WhatsAppWebhookPayload,
  ) {
    const signature = (req.headers['x-hub-signature-256'] as string) ?? undefined;
    const raw = req.rawBody ?? Buffer.from(JSON.stringify(payload));
    if (!this.whatsappService.verifySignature(raw, signature)) {
      throw new UnauthorizedException('Invalid WhatsApp webhook signature');
    }

    const messages = this.whatsappService.extractMessages(payload);

    for (const msg of messages) {
      if (msg.type !== 'text' || !msg.text?.body) continue;
      if (!(await this.whatsappService.tryClaimMessage(msg.id))) continue;

      await this.messageQueue.add('process-message', { message: msg, payload });
    }

    return { status: 'ok' };
  }
}

