import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";
import { AppModule } from "@/infra/app.module.ts";
import { EnvService } from "@/infra/env/env.service.ts";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const envService = app.get(EnvService);
  const corsOrigin = envService.get("CORS_ORIGIN");

  app.enableCors({
    origin:
      corsOrigin === "*"
        ? true
        : corsOrigin.split(",").map((origin) => origin.trim()),
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("Vero API")
    .setDescription("API documentation for Vero")
    .setVersion("1.0")
    .addTag("vero")
    .addBearerAuth()
    .build();

  const documentFactory = SwaggerModule.createDocument(app, config);

  app.use("/docs", apiReference({ content: documentFactory }));

  const port = envService.get("PORT");
  await app.listen(port);
}
bootstrap();
