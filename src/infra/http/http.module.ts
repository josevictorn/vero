import { Module } from "@nestjs/common";
import { RegisterAdminUseCase } from "@/domain/iam/application/use-cases/register-admin";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { RegisterAdminController } from "./controllers/iam/register-admin.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [RegisterAdminController],
  providers: [RegisterAdminUseCase],
})
export class HttpModule {}
