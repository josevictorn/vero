import { Module } from "@nestjs/common";
import { AuthenticateUseCase } from "@/domain/iam/application/use-cases/authenticate";
import { RegisterAdminUseCase } from "@/domain/iam/application/use-cases/register-admin.ts";
import { CryptographyModule } from "@/infra/cryptography/cryptography.module.ts";
import { DatabaseModule } from "@/infra/database/database.module.ts";
import { RegisterAdminController } from "@/infra/http/controllers/iam/register-admin.controller.ts";
import { AuthenticateController } from "./controllers/iam/authenticate.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [RegisterAdminController, AuthenticateController],
  providers: [RegisterAdminUseCase, AuthenticateUseCase],
})
export class HttpModule {}
