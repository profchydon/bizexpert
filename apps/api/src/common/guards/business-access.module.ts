import { Global, Module } from '@nestjs/common';
import { MembershipsModule } from '../../memberships/memberships.module';
import { BusinessAccessGuard } from './business-access.guard';
import { RolesGuard } from './roles.guard';

@Global()
@Module({
  imports: [MembershipsModule],
  providers: [BusinessAccessGuard, RolesGuard],
  exports: [BusinessAccessGuard, RolesGuard, MembershipsModule],
})
export class BusinessAccessModule {}
