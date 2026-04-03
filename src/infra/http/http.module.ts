import { Module } from "@nestjs/common";
import { AuthenticateUseCase } from "@/domain/iam/application/use-cases/authenticate";
import { RegisterAccountUseCase } from "@/domain/iam/application/use-cases/register-account";
import { RegisterAdminUseCase } from "@/domain/iam/application/use-cases/register-admin.ts";
import { CryptographyModule } from "@/infra/cryptography/cryptography.module.ts";
import { DatabaseModule } from "@/infra/database/database.module.ts";
import { RegisterAdminController } from "@/infra/http/controllers/iam/register-admin.controller.ts";
import { CaslModule } from "../auth/casl/casl.module";
import { AuthenticateController } from "./controllers/iam/authenticate.controller";
import { RegisterAccountController } from "./controllers/iam/register-account.controller";
import { GetUserProfileController } from "./controllers/iam/get-user-profile.controller";
import { GetUserProfileUseCase } from "@/domain/iam/application/use-cases/get-user-profile";

@Module({
  imports: [DatabaseModule, CryptographyModule, CaslModule],
  controllers: [
    RegisterAdminController,
    AuthenticateController,
    RegisterAccountController,
    GetUserProfileController,
  ],
  providers: [
    RegisterAdminUseCase,
    AuthenticateUseCase,
    RegisterAccountUseCase,
    GetUserProfileUseCase,
  ],
})
export class HttpModule {}
