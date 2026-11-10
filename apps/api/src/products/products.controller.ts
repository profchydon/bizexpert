import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { BusinessAccessGuard } from '../common/guards/business-access.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, Role } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { ProductsService } from './products.service';
import { ProductCreateService } from './product-create.service';
import { ProductBulkService, PRODUCT_IMPORT_TEMPLATE } from './product-bulk.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductFullDto } from './dto/create-product-full.dto';
import { BulkProductIdsDto, BulkProductsDto } from './dto/bulk-products.dto';
import { CreateProductUnitDto } from './dto/create-product-unit.dto';
import { ProductQueryDto } from './dto/product-query.dto';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessAccessGuard)
@Controller('businesses/:businessId/products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productCreateService: ProductCreateService,
    private readonly productBulkService: ProductBulkService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a product' })
  create(@Param('businessId') businessId: string, @Body() dto: CreateProductDto) {
    return this.productsService.create(businessId, dto);
  }

  @Post('full')
  @ApiOperation({ summary: 'Create a product with stores, variants, and opening stock' })
  createFull(
    @CurrentUser() user: User,
    @Param('businessId') businessId: string,
    @Body() dto: CreateProductFullDto,
  ) {
    return this.productCreateService.createFull(businessId, user.id, dto);
  }

  @Post('bulk-import')
  @ApiOperation({ summary: 'Bulk import products from parsed CSV rows' })
  bulkImport(
    @CurrentUser() user: User,
    @Param('businessId') businessId: string,
    @Body() dto: BulkProductsDto,
  ) {
    return this.productBulkService.importRows(businessId, user.id, dto.rows);
  }

  @Post('bulk-deactivate')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deactivate multiple products' })
  bulkDeactivate(
    @Param('businessId') businessId: string,
    @Body() dto: BulkProductIdsDto,
  ) {
    return this.productBulkService.deactivateMany(businessId, dto.ids);
  }

  @Get('import-template')
  @ApiOperation({ summary: 'CSV template for bulk product import' })
  importTemplate() {
    return { csv: PRODUCT_IMPORT_TEMPLATE };
  }

  @Get()
  @ApiOperation({ summary: 'List products' })
  findAll(@Param('businessId') businessId: string, @Query() query: ProductQueryDto) {
    return this.productsService.findAll(businessId, query);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search products by name' })
  search(@Param('businessId') businessId: string, @Query('q') q: string) {
    return this.productsService.searchProducts(businessId, q ?? '');
  }

  @Get('by-barcode/:code')
  @ApiOperation({ summary: 'Look up product by barcode / QR code' })
  findByBarcode(@Param('businessId') businessId: string, @Param('code') code: string) {
    return this.productsService.findByBarcode(businessId, decodeURIComponent(code));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single product' })
  findOne(@Param('businessId') businessId: string, @Param('id') id: string) {
    return this.productsService.findOne(id, businessId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product' })
  update(
    @Param('businessId') businessId: string,
    @Param('id') id: string,
    @Body() dto: Partial<CreateProductDto>,
  ) {
    return this.productsService.update(id, businessId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deactivate a product' })
  deactivate(@Param('businessId') businessId: string, @Param('id') id: string) {
    return this.productsService.deactivate(id, businessId);
  }

  @Post(':id/units')
  @ApiOperation({ summary: 'Add a packaging unit to a product' })
  addUnit(
    @Param('businessId') businessId: string,
    @Param('id') id: string,
    @Body() dto: CreateProductUnitDto,
  ) {
    return this.productsService.addUnit(id, businessId, dto);
  }

  @Put(':id/units/:unitId')
  @ApiOperation({ summary: 'Update a product unit' })
  updateUnit(
    @Param('businessId') businessId: string,
    @Param('id') id: string,
    @Param('unitId') unitId: string,
    @Body() dto: Partial<CreateProductUnitDto>,
  ) {
    return this.productsService.updateUnit(unitId, id, dto);
  }

  @Delete(':id/units/:unitId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product unit' })
  deleteUnit(
    @Param('businessId') businessId: string,
    @Param('id') id: string,
    @Param('unitId') unitId: string,
  ) {
    return this.productsService.deleteUnit(unitId, id);
  }
}

