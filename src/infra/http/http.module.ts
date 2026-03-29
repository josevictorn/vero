import { Module } from "@nestjs/common";
import { AuthenticateAdminUseCase } from "@/domain/iam/application/use-cases/authenticate-admin";
import { RegisterAdminUseCase } from "@/domain/iam/application/use-cases/register-admin.ts";
import { CryptographyModule } from "@/infra/cryptography/cryptography.module.ts";
import { DatabaseModule } from "@/infra/database/database.module.ts";
import { RegisterAdminController } from "@/infra/http/controllers/iam/register-admin.controller.ts";
import { AuthenticateAdminController } from "./controllers/iam/authenticate-admin.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [RegisterAdminController, AuthenticateAdminController],
  providers: [RegisterAdminUseCase, AuthenticateAdminUseCase],
})
export class HttpModule {}
