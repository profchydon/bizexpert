import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WhatsappIdentity } from '@prisma/client';
import { AuditService } from '../audit/audit.service';
import { WhatsappService } from './whatsapp.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WhatsappIdentitiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly whatsappService: WhatsappService,
  ) {}

  list(businessId: string) {
    return this.prisma.whatsappIdentity.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(
    businessId: string,
    userId: string,
    dto: { whatsappPhone: string; defaultLocationId?: string },
  ): Promise<WhatsappIdentity> {
    const phone = dto.whatsappPhone.trim();
    const existing = await this.prisma.whatsappIdentity.findUnique({
      where: { whatsappPhone: phone },
    });
    if (existing) {
      throw new ConflictException('This WhatsApp number is already linked');
    }

    const identity = await this.prisma.whatsappIdentity.create({
      data: {
        businessId,
        userId,
        whatsappPhone: phone,
        defaultLocationId: dto.defaultLocationId ?? null,
        isVerified: false,
      },
    });

    await this.whatsappService.sendMessage(
      phone.replace('+', ''),
      `BizExpert: Your number was linked. Reply VERIFY to confirm this device.`,
    );

    await this.auditService.log({
      businessId,
      userId,
      action: 'whatsapp.identity.created',
      entityType: 'WhatsappIdentity',
      entityId: identity.id,
      newState: { whatsappPhone: phone },
    });

    return identity;
  }

  async update(
    businessId: string,
    id: string,
    dto: { defaultLocationId?: string; isVerified?: boolean },
  ): Promise<WhatsappIdentity> {
    const identity = await this.prisma.whatsappIdentity.findFirst({
      where: { id, businessId },
    });
    if (!identity) {
      throw new NotFoundException('WhatsApp identity not found');
    }
    return this.prisma.whatsappIdentity.update({
      where: { id },
      data: {
        ...(dto.defaultLocationId !== undefined && {
          defaultLocationId: dto.defaultLocationId,
        }),
        ...(dto.isVerified !== undefined && { isVerified: dto.isVerified }),
      },
    });
  }

  async remove(businessId: string, id: string): Promise<void> {
    const identity = await this.prisma.whatsappIdentity.findFirst({
      where: { id, businessId },
    });
    if (!identity) {
      throw new NotFoundException('WhatsApp identity not found');
    }
    await this.prisma.whatsappIdentity.delete({ where: { id } });
  }

  async verifyByPhone(phone: string): Promise<WhatsappIdentity | null> {
    const identity = await this.prisma.whatsappIdentity.findUnique({
      where: { whatsappPhone: phone },
    });
    if (!identity) return null;
    return this.prisma.whatsappIdentity.update({
      where: { id: identity.id },
      data: { isVerified: true },
    });
  }
}
