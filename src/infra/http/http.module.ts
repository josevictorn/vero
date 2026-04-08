import { Module } from "@nestjs/common";
import { AuthenticateUseCase } from "@/domain/iam/application/use-cases/authenticate";
import { FetchAccountsUseCase } from "@/domain/iam/application/use-cases/fetch-accounts";
import { GetUserProfileUseCase } from "@/domain/iam/application/use-cases/get-user-profile";
import { RegisterAccountUseCase } from "@/domain/iam/application/use-cases/register-account";
import { RegisterAdminUseCase } from "@/domain/iam/application/use-cases/register-admin.ts";

import { CreateScreeningFlowUseCase } from "@/domain/crm/application/use-cases/screening-flow/create-screening-flow";
import { GetScreeningFlowUseCase } from "@/domain/crm/application/use-cases/screening-flow/get-screening-flow";
import { FetchScreeningFlowsUseCase } from "@/domain/crm/application/use-cases/screening-flow/fetch-screening-flows";
import { EditScreeningFlowUseCase } from "@/domain/crm/application/use-cases/screening-flow/edit-screening-flow";
import { DeleteScreeningFlowUseCase } from "@/domain/crm/application/use-cases/screening-flow/delete-screening-flow";

import { CryptographyModule } from "@/infra/cryptography/cryptography.module.ts";
import { DatabaseModule } from "@/infra/database/database.module.ts";
import { CaslModule } from "../auth/casl/casl.module";

import { RegisterAdminController } from "@/infra/http/controllers/iam/register-admin.controller.ts";
import { AuthenticateController } from "./controllers/iam/authenticate.controller";
import { FetchAccountsController } from "./controllers/iam/fetch-accounts";
import { GetUserProfileController } from "./controllers/iam/get-user-profile.controller";
import { RegisterAccountController } from "./controllers/iam/register-account.controller";

import { CreateScreeningFlowController } from "./controllers/crm/screening-flow/create-screening-flow.controller";
import { GetScreeningFlowController } from "./controllers/crm/screening-flow/get-screening-flow.controller";
import { FetchScreeningFlowsController } from "./controllers/crm/screening-flow/fetch-screening-flows.controller";
import { EditScreeningFlowController } from "./controllers/crm/screening-flow/edit-screening-flow.controller";
import { DeleteScreeningFlowController } from "./controllers/crm/screening-flow/delete-screening-flow.controller";

import { GetWorkspaceUseCase } from "@/domain/crm/application/use-cases/workspace/get-workspace";
import { EditWorkspaceUseCase } from "@/domain/crm/application/use-cases/workspace/edit-workspace";
import { GetWorkspaceController } from "./controllers/crm/workspace/get-workspace.controller";
import { EditWorkspaceController } from "./controllers/crm/workspace/edit-workspace.controller";

import { CreateLawyerController } from "./controllers/crm/lawyer/create-lawyer.controller";
import { GetLawyerController } from "./controllers/crm/lawyer/get-lawyer.controller";
import { FetchLawyersController } from "./controllers/crm/lawyer/fetch-lawyers.controller";
import { EditLawyerController } from "./controllers/crm/lawyer/edit-lawyer.controller";
import { DeleteLawyerController } from "./controllers/crm/lawyer/delete-lawyer.controller";

import { CreateLawyerUseCase } from "@/domain/crm/application/use-cases/lawyer/create-lawyer";
import { GetLawyerUseCase } from "@/domain/crm/application/use-cases/lawyer/get-lawyer";
import { FetchLawyersUseCase } from "@/domain/crm/application/use-cases/lawyer/fetch-lawyers";
import { EditLawyerUseCase } from "@/domain/crm/application/use-cases/lawyer/edit-lawyer";
import { DeleteLawyerUseCase } from "@/domain/crm/application/use-cases/lawyer/delete-lawyer";

import { CreateLeadController } from "./controllers/crm/lead/create-lead.controller";
import { GetLeadController } from "./controllers/crm/lead/get-lead.controller";
import { FetchLeadsController } from "./controllers/crm/lead/fetch-leads.controller";
import { EditLeadController } from "./controllers/crm/lead/edit-lead.controller";
import { DeleteLeadController } from "./controllers/crm/lead/delete-lead.controller";

import { CreateLeadUseCase } from "@/domain/crm/application/use-cases/lead/create-lead";
import { GetLeadUseCase } from "@/domain/crm/application/use-cases/lead/get-lead";
import { FetchLeadsUseCase } from "@/domain/crm/application/use-cases/lead/fetch-leads";
import { EditLeadUseCase } from "@/domain/crm/application/use-cases/lead/edit-lead";
import { DeleteLeadUseCase } from "@/domain/crm/application/use-cases/lead/delete-lead";

import { CreateAISessionController } from "./controllers/crm/ai-session/create-ai-session.controller";

import { CreateAISessionUseCase } from "@/domain/crm/application/use-cases/ai-session/create-ai-session";
import { EditAiSessionController } from "./controllers/crm/ai-session/edit-ai-session.controller";
import { EditAiSessionUseCase } from "@/domain/crm/application/use-cases/ai-session/edit-ai-session";

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
    GetWorkspaceController,
    EditWorkspaceController,
    CreateLawyerController,
    GetLawyerController,
    FetchLawyersController,
    EditLawyerController,
    DeleteLawyerController,
    CreateLeadController,
    GetLeadController,
    FetchLeadsController,
    EditLeadController,
    DeleteLeadController,
    CreateAISessionController,
    EditAiSessionController,
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
    GetWorkspaceUseCase,
    EditWorkspaceUseCase,
    CreateLawyerUseCase,
    GetLawyerUseCase,
    FetchLawyersUseCase,
    EditLawyerUseCase,
    DeleteLawyerUseCase,
    CreateLeadUseCase,
    GetLeadUseCase,
    FetchLeadsUseCase,
    EditLeadUseCase,
    DeleteLeadUseCase,
    CreateAISessionUseCase,
    EditAiSessionUseCase,
  ],
})
export class HttpModule {}
