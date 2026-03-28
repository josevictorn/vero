import { Module } from "@nestjs/common";
import { RegisterAdminUseCase } from "@/domain/iam/application/use-cases/register-admin.ts";
import { CryptographyModule } from "@/infra/cryptography/cryptography.module.ts";
import { DatabaseModule } from "@/infra/database/database.module.ts";
import { RegisterAdminController } from "@/infra/http/controllers/iam/register-admin.controller.ts";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [RegisterAdminController],
  providers: [RegisterAdminUseCase],
})
export class HttpModule {}
