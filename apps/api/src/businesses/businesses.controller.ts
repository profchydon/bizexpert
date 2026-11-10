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
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';

@ApiTags('Businesses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new business' })
  create(@CurrentUser() user: User, @Body() dto: CreateBusinessDto) {
    return this.businessesService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all businesses for the current user' })
  findAll(@CurrentUser() user: User) {
    return this.businessesService.findAllByUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single business' })
  findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.businessesService.findOne(id, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update business details' })
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateBusinessDto,
  ) {
    return this.businessesService.update(id, user.id, dto);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'List all members of a business' })
  getMembers(@CurrentUser() user: User, @Param('id') id: string) {
    return this.businessesService.getMembers(id, user.id);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Add a member to the business' })
  addMember(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: AddMemberDto,
  ) {
    return this.businessesService.addMember(id, user.id, dto);
  }

  @Put(':id/members/:memberId')
  @ApiOperation({ summary: "Update a member's role" })
  updateMemberRole(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body() dto: UpdateMemberRoleDto,
  ) {
    return this.businessesService.updateMemberRole(id, user.id, memberId, dto);
  }

  @Delete(':id/members/:memberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a member from the business' })
  removeMember(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Param('memberId') memberId: string,
  ) {
    return this.businessesService.removeMember(id, user.id, memberId);
  }
}
