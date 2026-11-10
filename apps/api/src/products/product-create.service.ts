import { BadRequestException, Injectable } from '@nestjs/common';
import { Product, ProductKind } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateProductFullDto } from './dto/create-product-full.dto';
import { applyOpeningStock } from './product-opening.util';

@Injectable()
export class ProductCreateService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertLocations(businessId: string, locationIds: string[]) {
    const count = await this.prisma.location.count({
      where: { businessId, isActive: true, id: { in: locationIds } },
    });
    if (count !== locationIds.length) {
      throw new BadRequestException('One or more stores are invalid');
    }
  }

  async createFull(
    businessId: string,
    userId: string,
    dto: CreateProductFullDto,
  ): Promise<Product> {
    await this.assertLocations(businessId, dto.locationIds);
    const kind = dto.kind ?? ProductKind.product;
    if (dto.hasVariants) {
      if (!dto.variants?.length) {
        throw new BadRequestException('Add at least one variant');
      }
    } else if (!dto.sellingPrice || !dto.purchaseCost) {
      throw new BadRequestException('Selling price and cost are required');
    }

    return this.prisma.$transaction(async (tx) => {
      const parent = await tx.product.create({
        data: {
          businessId,
          name: dto.name.trim(),
          kind,
          hasVariants: dto.hasVariants,
          category: dto.category?.trim() || null,
          subCategory: dto.subCategory?.trim() || null,
          sku: dto.hasVariants ? null : dto.sku?.trim() || null,
          barcode: dto.hasVariants ? null : dto.barcode?.trim() || null,
          baseUnit: dto.baseUnit.trim(),
          imageUrl: dto.imageUrl ?? null,
          sellingPrice: dto.hasVariants ? 0 : dto.sellingPrice!,
          purchaseCost: dto.hasVariants ? 0 : dto.purchaseCost!,
          lowStockThreshold: dto.lowStockThreshold ?? 0,
        },
      });

      await tx.productLocation.createMany({
        data: dto.locationIds.map((locationId) => ({
          productId: parent.id,
          locationId,
        })),
      });

      if (dto.hasVariants && dto.variants) {
        for (const variant of dto.variants) {
          const child = await tx.product.create({
            data: {
              businessId,
              parentProductId: parent.id,
              name: variant.name.trim(),
              kind,
              hasVariants: false,
              category: dto.category?.trim() || null,
          subCategory: dto.subCategory?.trim() || null,
              sku: variant.sku?.trim() || null,
              barcode: variant.barcode?.trim() || null,
              baseUnit: dto.baseUnit.trim(),
              imageUrl: dto.imageUrl ?? null,
              sellingPrice: variant.sellingPrice,
              purchaseCost: variant.purchaseCost,
              lowStockThreshold: dto.lowStockThreshold ?? 0,
            },
          });
          if (kind === ProductKind.product && variant.openingStock?.length) {
            for (const row of variant.openingStock) {
              if (!dto.locationIds.includes(row.locationId)) continue;
              await applyOpeningStock(tx, {
                businessId,
                locationId: row.locationId,
                productId: child.id,
                userId,
                quantity: row.quantity,
                unitCost: variant.purchaseCost,
              });
            }
          }
        }
        return parent;
      }

      if (kind === ProductKind.product && dto.openingStock?.length) {
        for (const row of dto.openingStock) {
          if (!dto.locationIds.includes(row.locationId)) continue;
          await applyOpeningStock(tx, {
            businessId,
            locationId: row.locationId,
            productId: parent.id,
            userId,
            quantity: row.quantity,
            unitCost: dto.purchaseCost!,
          });
        }
      }

      return parent;
    });
  }
}
