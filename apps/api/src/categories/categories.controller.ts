import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { BusinessAccessGuard } from '../common/guards/business-access.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './create-category.dto';

@ApiTags("Categories")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessAccessGuard)
@Controller("businesses/:businessId/categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: "Create a category" })
  create(
    @CurrentUser() user: User,
    @Param("businessId") businessId: string,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(businessId, user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: "List categories" })
  findAll(@CurrentUser() user: User, @Param("businessId") businessId: string) {
    return this.categoriesService.findAll(businessId, user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a category" })
  findOne(
    @CurrentUser() user: User,
    @Param("businessId") businessId: string,
    @Param("id") id: string,
  ) {
    return this.categoriesService.findOne(id, businessId, user.id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Rename a category" })
  update(
    @CurrentUser() user: User,
    @Param("businessId") businessId: string,
    @Param("id") id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, businessId, user.id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a category" })
  remove(
    @CurrentUser() user: User,
    @Param("businessId") businessId: string,
    @Param("id") id: string,
  ) {
    return this.categoriesService.remove(id, businessId, user.id);
  }
}
