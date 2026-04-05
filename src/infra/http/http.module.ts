import { Module } from "@nestjs/common";
import { AuthenticateUseCase } from "@/domain/iam/application/use-cases/authenticate";
import { FetchAccountsUseCase } from "@/domain/iam/application/use-cases/fetch-accounts";
import { GetUserProfileUseCase } from "@/domain/iam/application/use-cases/get-user-profile";
import { RegisterAccountUseCase } from "@/domain/iam/application/use-cases/register-account";
import { RegisterAdminUseCase } from "@/domain/iam/application/use-cases/register-admin.ts";
import { CryptographyModule } from "@/infra/cryptography/cryptography.module.ts";
import { DatabaseModule } from "@/infra/database/database.module.ts";
import { RegisterAdminController } from "@/infra/http/controllers/iam/register-admin.controller.ts";
import { CaslModule } from "../auth/casl/casl.module";
import { AuthenticateController } from "./controllers/iam/authenticate.controller";
import { FetchAccountsController } from "./controllers/iam/fetch-accounts";
import { GetUserProfileController } from "./controllers/iam/get-user-profile.controller";
import { RegisterAccountController } from "./controllers/iam/register-account.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule, CaslModule],
  controllers: [
    RegisterAdminController,
    AuthenticateController,
    RegisterAccountController,
    GetUserProfileController,
    FetchAccountsController,
  ],
  providers: [
    RegisterAdminUseCase,
    AuthenticateUseCase,
    RegisterAccountUseCase,
    GetUserProfileUseCase,
    FetchAccountsUseCase,
  ],
})
export class HttpModule {}
