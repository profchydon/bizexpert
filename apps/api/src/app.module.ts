import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { BullModule } from "@nestjs/bull";
import { ScheduleModule } from "@nestjs/schedule";

import { PrismaModule } from "./prisma/prisma.module";

// Feature modules
import { AuthModule } from "./auth/auth.module";
import { BusinessesModule } from "./businesses/businesses.module";
import { LocationsModule } from "./locations/locations.module";
import { MembershipsModule } from "./memberships/memberships.module";
import { ProductsModule } from "./products/products.module";
import { CategoriesModule } from "./categories/categories.module";
import { InventoryModule } from "./inventory/inventory.module";
import { SalesModule } from "./sales/sales.module";
import { PurchasesModule } from "./purchases/purchases.module";
import { PaymentsModule } from "./payments/payments.module";
import { AnalyticsModule } from "./analytics/analytics.module";
import { WhatsappModule } from "./whatsapp/whatsapp.module";
import { AiModule } from "./ai/ai.module";
import { PendingActionsModule } from "./pending-actions/pending-actions.module";
import { AuditModule } from "./audit/audit.module";
import { BusinessAccessModule } from "./common/guards/business-access.module";
import { StocktakesModule } from "./stocktakes/stocktakes.module";
import { SuppliersModule } from "./suppliers/suppliers.module";
import { CustomersModule } from "./customers/customers.module";
import { NotificationsModule } from "./notifications/notifications.module";

@Module({
  imports: [
    BusinessAccessModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
      cache: true,
    }),
    PrismaModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get<string>("REDIS_HOST", "localhost"),
          port: config.get<number>("REDIS_PORT", 6379),
          password: config.get<string>("REDIS_PASSWORD"),
          tls: config.get<string>("NODE_ENV") === "production" ? {} : undefined,
        },
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 1_000,
          },
          removeOnComplete: 100,
          removeOnFail: 200,
        },
      }),
    }),
    AuthModule,
    BusinessesModule,
    LocationsModule,
    MembershipsModule,
    ProductsModule,
    CategoriesModule,
    InventoryModule,
    SalesModule,
    PurchasesModule,
    PaymentsModule,
    AnalyticsModule,
    WhatsappModule,
    AiModule,
    PendingActionsModule,
    AuditModule,
    StocktakesModule,
    SuppliersModule,
    CustomersModule,
    NotificationsModule,
  ],
})
export class AppModule {}
