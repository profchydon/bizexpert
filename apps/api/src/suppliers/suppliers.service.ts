import { Injectable, NotFoundException } from '@nestjs/common';
import { Supplier } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuppliersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    businessId: string,
    dto: { name: string; phone?: string; email?: string; address?: string; notes?: string },
  ): Promise<Supplier> {
    return this.prisma.supplier.create({
      data: {
        businessId,
        name: dto.name,
        phone: dto.phone ?? null,
        email: dto.email ?? null,
        address: dto.address ?? null,
        notes: dto.notes ?? null,
      },
    });
  }

  async findAll(businessId: string): Promise<Supplier[]> {
    return this.prisma.supplier.findMany({
      where: { businessId, isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, businessId: string): Promise<Supplier> {
    const s = await this.prisma.supplier.findFirst({
      where: { id, businessId },
    });
    if (!s) throw new NotFoundException('Supplier not found');
    return s;
  }

  async update(
    id: string,
    businessId: string,
    dto: Partial<{ name: string; phone: string; email: string; address: string; notes: string }>,
  ): Promise<Supplier> {
    await this.findOne(id, businessId);
    return this.prisma.supplier.update({
      where: { id },
      data: dto,
    });
  }

  async deactivate(id: string, businessId: string): Promise<void> {
    await this.findOne(id, businessId);
    await this.prisma.supplier.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
