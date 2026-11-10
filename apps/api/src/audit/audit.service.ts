import { Injectable } from '@nestjs/common';
import { AuditLog, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(dto: {
    businessId: string;
    userId?: string;
    action: string;
    entityType: string;
    entityId?: string;
    previousState?: object;
    newState?: object;
    metadata?: object;
  }): Promise<AuditLog> {
    return this.prisma.auditLog.create({
      data: {
        businessId: dto.businessId,
        userId: dto.userId ?? null,
        action: dto.action,
        entityType: dto.entityType,
        entityId: dto.entityId ?? null,
        previousState: (dto.previousState ?? null) as Prisma.InputJsonValue,
        newState: (dto.newState ?? null) as Prisma.InputJsonValue,
        metadata: (dto.metadata ?? null) as Prisma.InputJsonValue,
      },
    });
  }

  async findAll(
    businessId: string,
    query: { page?: number; limit?: number; entityType?: string },
  ): Promise<{ data: AuditLog[]; total: number }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: Prisma.AuditLogWhereInput = { businessId };
    if (query.entityType) {
      where.entityType = query.entityType;
    }

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { data, total };
  }
}
