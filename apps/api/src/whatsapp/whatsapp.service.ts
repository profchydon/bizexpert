import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import Redis from "ioredis";
import { createHmac, timingSafeEqual } from "crypto";
import { Business, User, WhatsappIdentity } from "@prisma/client";

import { redisConnectionOptions } from "../common/redis.util";
import { PrismaService } from "../prisma/prisma.service";

export interface WhatsAppMessage {
  from: string;
  id: string;
  timestamp: string;
  text?: { body: string };
  type: string;
}

export interface WhatsAppWebhookPayload {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messages?: WhatsAppMessage[];
        metadata?: { phone_number_id: string; display_phone_number: string };
      };
      field: string;
    }>;
  }>;
}

export type WhatsappIdentityWithRelations = WhatsappIdentity & {
  user: User;
  business: Business;
};

@Injectable()
export class WhatsappService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(WhatsappService.name);
  private readonly accessToken: string;
  private readonly phoneNumberId: string;
  private readonly apiUrl: string;
  private readonly appSecret: string;
  private redis: Redis | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.accessToken = this.configService.get<string>(
      "WHATSAPP_ACCESS_TOKEN",
      "",
    );
    this.phoneNumberId = this.configService.get<string>(
      "WHATSAPP_PHONE_NUMBER_ID",
      "",
    );
    this.appSecret = this.configService.get<string>("WHATSAPP_APP_SECRET", "");
    this.apiUrl = `https://graph.facebook.com/v19.0/${this.phoneNumberId}/messages`;
  }

  onModuleInit() {
    this.redis = new Redis({
      ...redisConnectionOptions(this.configService),
      maxRetriesPerRequest: 3,
    });
  }

  onModuleDestroy() {
    this.redis?.disconnect();
  }

  verifySignature(rawBody: Buffer, signatureHeader?: string): boolean {
    if (!this.appSecret) {
      this.logger.warn(
        "WHATSAPP_APP_SECRET not set — skipping signature verification",
      );
      return true;
    }
    if (!signatureHeader?.startsWith("sha256=")) {
      return false;
    }
    const expected = createHmac("sha256", this.appSecret)
      .update(rawBody)
      .digest("hex");
    const received = signatureHeader.slice("sha256=".length);
    try {
      return timingSafeEqual(Buffer.from(expected), Buffer.from(received));
    } catch {
      return false;
    }
  }

  async tryClaimMessage(messageId: string): Promise<boolean> {
    if (!this.redis) return true;
    const result = await this.redis.set(
      `wa:dedup:${messageId}`,
      "1",
      "EX",
      86_400,
      "NX",
    );
    return result === "OK";
  }

  async sendMessage(to: string, message: string): Promise<void> {
    if (!this.accessToken || !this.phoneNumberId) {
      this.logger.warn("WhatsApp credentials not configured — skipping send");
      return;
    }
    try {
      await axios.post(
        this.apiUrl,
        {
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body: message },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );
    } catch (err: any) {
      this.logger.error(
        `Failed to send WhatsApp message to ${to}: ${err.message}`,
      );
    }
  }

  normalizePhone(from: string): string {
    return from.startsWith("+") ? from : `+${from}`;
  }

  async findIdentityByPhone(
    phone: string,
  ): Promise<WhatsappIdentityWithRelations | null> {
    const normalized = this.normalizePhone(phone);
    const identity = await this.prisma.whatsappIdentity.findFirst({
      where: {
        OR: [{ whatsappPhone: normalized }, { whatsappPhone: phone }],
      },
      include: { user: true },
    });
    if (!identity) return null;

    const business = await this.prisma.business.findUniqueOrThrow({
      where: { id: identity.businessId },
    });

    return { ...identity, business };
  }

  extractMessages(payload: WhatsAppWebhookPayload): WhatsAppMessage[] {
    const messages: WhatsAppMessage[] = [];
    for (const entry of payload.entry ?? []) {
      for (const change of entry.changes ?? []) {
        for (const msg of change.value?.messages ?? []) {
          messages.push(msg);
        }
      }
    }
    return messages;
  }
}
