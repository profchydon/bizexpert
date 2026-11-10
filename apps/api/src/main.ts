import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log", "debug", "verbose"],
    rawBody: true,
  });
  const logger = new Logger("Bootstrap");
  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT", 3001);
  const nodeEnv = configService.get<string>("NODE_ENV", "development");

  // Global prefix
  app.setGlobalPrefix("api/v1");

  // CORS
  app.enableCors({
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Swagger – only in non-production environments or always for internal use
  if (nodeEnv !== "production") {
    const swaggerConfig = new DocumentBuilder()
      .setTitle("BizExpert API")
      .setDescription(
        "BizExpert inventory management API for Nigerian SMEs. " +
          "All monetary values are in Nigerian Naira (NGN).",
      )
      .setVersion("1.0")
      .addBearerAuth(
        {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          name: "Authorization",
          description: "Enter JWT token",
          in: "header",
        },
        "JWT-auth",
      )
      .addTag("Auth", "Authentication & authorization")
      .addTag("Businesses", "Business management")
      .addTag("Locations", "Business locations / branches")
      .addTag("Memberships", "Staff membership & roles")
      .addTag("Products", "Product catalogue")
      .addTag("Categories", "Product categories")
      .addTag("Inventory", "Stock tracking & adjustments")
      .addTag("Sales", "Sales orders & line items")
      .addTag("Purchases", "Purchase orders & receiving")
      .addTag("Payments", "Payment records")
      .addTag("Analytics", "Reporting & analytics")
      .addTag("WhatsApp", "WhatsApp bot integration")
      .addTag("AI", "AI assistant endpoints")
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("api/v1/docs", app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: "alpha",
        operationsSorter: "alpha",
      },
    });

    logger.log(
      `Swagger docs available at: http://localhost:${port}/api/v1/docs`,
    );
  }

  await app.listen(port);
  logger.log(`🚀 BizExpert API running on: http://localhost:${port}/api/v1`);
  logger.log(`Environment: ${nodeEnv}`);
}

bootstrap();
