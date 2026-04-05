import { Module } from "@nestjs/common";
import { AuthenticateUseCase } from "@/domain/iam/application/use-cases/authenticate";
import { FetchAccountsUseCase } from "@/domain/iam/application/use-cases/fetch-accounts";
import { GetUserProfileUseCase } from "@/domain/iam/application/use-cases/get-user-profile";
import { RegisterAccountUseCase } from "@/domain/iam/application/use-cases/register-account";
import { RegisterAdminUseCase } from "@/domain/iam/application/use-cases/register-admin.ts";

import { CreateScreeningFlowUseCase } from "@/domain/crm/application/use-cases/create-screening-flow";
import { GetScreeningFlowUseCase } from "@/domain/crm/application/use-cases/get-screening-flow";
import { FetchScreeningFlowsUseCase } from "@/domain/crm/application/use-cases/fetch-screening-flows";
import { EditScreeningFlowUseCase } from "@/domain/crm/application/use-cases/edit-screening-flow";
import { DeleteScreeningFlowUseCase } from "@/domain/crm/application/use-cases/delete-screening-flow";

import { CryptographyModule } from "@/infra/cryptography/cryptography.module.ts";
import { DatabaseModule } from "@/infra/database/database.module.ts";
import { CaslModule } from "../auth/casl/casl.module";

import { RegisterAdminController } from "@/infra/http/controllers/iam/register-admin.controller.ts";
import { AuthenticateController } from "./controllers/iam/authenticate.controller";
import { FetchAccountsController } from "./controllers/iam/fetch-accounts";
import { GetUserProfileController } from "./controllers/iam/get-user-profile.controller";
import { RegisterAccountController } from "./controllers/iam/register-account.controller";

import { CreateScreeningFlowController } from "./controllers/crm/create-screening-flow.controller";
import { GetScreeningFlowController } from "./controllers/crm/get-screening-flow.controller";
import { FetchScreeningFlowsController } from "./controllers/crm/fetch-screening-flows.controller";
import { EditScreeningFlowController } from "./controllers/crm/edit-screening-flow.controller";
import { DeleteScreeningFlowController } from "./controllers/crm/delete-screening-flow.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule, CaslModule],
  controllers: [
    RegisterAdminController,
    AuthenticateController,
    RegisterAccountController,
    GetUserProfileController,
    FetchAccountsController,
    CreateScreeningFlowController,
    GetScreeningFlowController,
    FetchScreeningFlowsController,
    EditScreeningFlowController,
    DeleteScreeningFlowController,
  ],
  providers: [
    RegisterAdminUseCase,
    AuthenticateUseCase,
    RegisterAccountUseCase,
    GetUserProfileUseCase,
    FetchAccountsUseCase,
    CreateScreeningFlowUseCase,
    GetScreeningFlowUseCase,
    FetchScreeningFlowsUseCase,
    EditScreeningFlowUseCase,
    DeleteScreeningFlowUseCase,
  ],
})
export class HttpModule {}
