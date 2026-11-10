import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma, Product, ProductUnit } from '@prisma/client';

import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductUnitDto } from './dto/create-product-unit.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { toPrismaSortOrder } from '../common/utils/prisma-sort.util';
import { PrismaService } from '../prisma/prisma.service';
import { attachProductListMeta, ProductListRow } from './product-list.util';
import { productSearchOr } from './product-search.util';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(businessId: string, dto: CreateProductDto): Promise<Product> {
    if (dto.sku) {
      const existing = await this.prisma.product.findFirst({
        where: { businessId, sku: dto.sku },
      });
      if (existing) {
        throw new ConflictException(
          `A product with SKU "${dto.sku}" already exists in this business.`,
        );
      }
    }

    if (dto.barcode) {
      const existingBarcode = await this.prisma.product.findFirst({
        where: { businessId, barcode: dto.barcode },
      });
      if (existingBarcode) {
        throw new ConflictException(
          `A product with barcode "${dto.barcode}" already exists in this business.`,
        );
      }
    }

    return this.prisma.product.create({
      data: {
        businessId,
        name: dto.name,
        sku: dto.sku ?? null,
        barcode: dto.barcode ?? null,
        category: dto.category ?? null,
        subCategory: dto.subCategory ?? null,
        description: dto.description ?? null,
        sellingPrice: dto.sellingPrice,
        purchaseCost: dto.purchaseCost,
        baseUnit: dto.baseUnit ?? 'piece',
        imageUrl: dto.imageUrl ?? null,
        lowStockThreshold: dto.lowStockThreshold ?? 0,
        isActive: true,
      },
    });
  }

  async findAll(
    businessId: string,
    query: ProductQueryDto,
  ): Promise<{ data: ProductListRow[]; total: number }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      businessId,
      parentProductId: null,
    };

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }
    if (query.category) {
      where.category = query.category;
    }
    if (query.subCategory) {
      where.subCategory = query.subCategory;
    }
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { sku: { contains: query.search, mode: 'insensitive' } },
        { category: { contains: query.search, mode: 'insensitive' } },
        { subCategory: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const sortBy = query.sortBy ?? 'createdAt';
    const sortOrder = toPrismaSortOrder(query.sortOrder);

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    const enriched = await attachProductListMeta(this.prisma, data);
    return { data: enriched, total };
  }

  async findOne(
    productId: string,
    businessId: string,
  ): Promise<
    Product & {
      productUnits: ProductUnit[];
      variants: Product[];
      locationIds: string[];
    }
  > {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, businessId },
      include: {
        productUnits: true,
        variants: { where: { isActive: true }, orderBy: { name: 'asc' } },
        productLocations: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product ${productId} not found.`);
    }

    return {
      ...product,
      locationIds: product.productLocations.map((row) => row.locationId),
    };
  }

  async findByBarcode(
    businessId: string,
    barcode: string,
  ): Promise<Product & { productUnits: ProductUnit[] }> {
    const code = barcode.trim();
    if (!code) {
      throw new BadRequestException('Barcode is required');
    }
    const product = await this.prisma.product.findFirst({
      where: { businessId, barcode: code, isActive: true },
      include: { productUnits: true },
    });
    if (!product) {
      throw new NotFoundException(`No product found for barcode "${code}"`);
    }
    return product;
  }

  async update(
    productId: string,
    businessId: string,
    dto: Partial<CreateProductDto>,
  ): Promise<Product> {
    const product = await this.findOne(productId, businessId);

    if (dto.sku && dto.sku !== product.sku) {
      const duplicate = await this.prisma.product.findFirst({
        where: { businessId, sku: dto.sku },
      });
      if (duplicate && duplicate.id !== productId) {
        throw new ConflictException(
          `Another product with SKU "${dto.sku}" already exists.`,
        );
      }
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.sku !== undefined && { sku: dto.sku }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.subCategory !== undefined && { subCategory: dto.subCategory }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.sellingPrice !== undefined && {
          sellingPrice: dto.sellingPrice,
        }),
        ...(dto.purchaseCost !== undefined && {
          purchaseCost: dto.purchaseCost,
        }),
        ...(dto.baseUnit !== undefined && { baseUnit: dto.baseUnit }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.barcode !== undefined && { barcode: dto.barcode }),
        ...(dto.lowStockThreshold !== undefined && {
          lowStockThreshold: dto.lowStockThreshold,
        }),
      },
    });
  }

  async deactivate(productId: string, businessId: string): Promise<void> {
    await this.findOne(productId, businessId);
    await this.prisma.product.update({
      where: { id: productId },
      data: { isActive: false },
    });
  }

  async addUnit(
    productId: string,
    businessId: string,
    dto: CreateProductUnitDto,
  ): Promise<ProductUnit> {
    await this.findOne(productId, businessId);

    const existing = await this.prisma.productUnit.findFirst({
      where: { productId, unitName: dto.unitName },
    });
    if (existing) {
      throw new ConflictException(
        `Unit "${dto.unitName}" already exists for this product.`,
      );
    }

    return this.prisma.productUnit.create({
      data: {
        productId,
        unitName: dto.unitName,
        conversionFactor: dto.conversionFactor,
        sellingPrice: dto.sellingPrice ?? null,
      },
    });
  }

  async updateUnit(
    unitId: string,
    productId: string,
    dto: Partial<CreateProductUnitDto>,
  ): Promise<ProductUnit> {
    const unit = await this.prisma.productUnit.findFirst({
      where: { id: unitId, productId },
    });
    if (!unit) {
      throw new NotFoundException(`Product unit ${unitId} not found.`);
    }

    return this.prisma.productUnit.update({
      where: { id: unitId },
      data: {
        ...(dto.unitName !== undefined && { unitName: dto.unitName }),
        ...(dto.conversionFactor !== undefined && {
          conversionFactor: dto.conversionFactor,
        }),
        ...(dto.sellingPrice !== undefined && {
          sellingPrice: dto.sellingPrice,
        }),
      },
    });
  }

  async deleteUnit(unitId: string, productId: string): Promise<void> {
    const unit = await this.prisma.productUnit.findFirst({
      where: { id: unitId, productId },
    });
    if (!unit) {
      throw new NotFoundException(`Product unit ${unitId} not found.`);
    }
    await this.prisma.productUnit.delete({ where: { id: unitId } });
  }

  async searchProducts(
    businessId: string,
    query: string,
  ): Promise<(Product & { productUnits: ProductUnit[] })[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const q = query.trim();
    return this.prisma.product.findMany({
      where: {
        businessId,
        isActive: true,
        OR: productSearchOr(q),
      },
      include: { productUnits: true },
      orderBy: { name: 'asc' },
      take: 20,
    });
  }
}
