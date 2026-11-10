import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductKind } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { BulkProductRowDto } from './dto/bulk-product-row.dto';
import { applyOpeningStock } from './product-opening.util';

export const PRODUCT_IMPORT_TEMPLATE =
  'location_name,product_name,category,sub_category,sku,barcode,unit,type,selling_price,cost_price,opening_quantity\n';

@Injectable()
export class ProductBulkService {
  constructor(private readonly prisma: PrismaService) {}

  async importRows(
    businessId: string,
    userId: string,
    rows: BulkProductRowDto[],
  ): Promise<{ created: number }> {
    const locations = await this.prisma.location.findMany({
      where: { businessId, isActive: true },
    });
    const byName = new Map(
      locations.map((row) => [row.name.trim().toLowerCase(), row.id]),
    );

    let created = 0;
    await this.prisma.$transaction(async (tx) => {
      for (const row of rows) {
        const locationId = byName.get(row.locationName.trim().toLowerCase());
        if (!locationId) {
          throw new BadRequestException(
            `Unknown store "${row.locationName}" for "${row.name}"`,
          );
        }
        const kind = row.kind ?? ProductKind.product;
        const product = await tx.product.create({
          data: {
            businessId,
            name: row.name.trim(),
            kind,
            category: row.category?.trim() || null,
            subCategory: row.subCategory?.trim() || null,
            sku: row.sku?.trim() || null,
            barcode: row.barcode?.trim() || null,
            baseUnit: row.baseUnit.trim(),
            sellingPrice: row.sellingPrice,
            purchaseCost: row.purchaseCost,
            lowStockThreshold: 0,
          },
        });
        await tx.productLocation.create({
          data: { productId: product.id, locationId },
        });
        const qty = row.openingQuantity ?? 0;
        if (kind === ProductKind.product && qty > 0) {
          await applyOpeningStock(tx, {
            businessId,
            locationId,
            productId: product.id,
            userId,
            quantity: qty,
            unitCost: row.purchaseCost,
          });
        }
        created += 1;
      }
    });
    return { created };
  }

  async deactivateMany(businessId: string, ids: string[]): Promise<void> {
    await this.prisma.product.updateMany({
      where: {
        businessId,
        OR: [{ id: { in: ids } }, { parentProductId: { in: ids } }],
      },
      data: { isActive: false },
    });
  }
}
