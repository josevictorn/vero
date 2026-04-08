import { Module } from "@nestjs/common";
import { AccountsRepository } from "@/domain/iam/application/repositories/accounts-repository";
import { AdminsRepository } from "@/domain/iam/application/repositories/admins-repository.ts";
import { PrismaService } from "@/infra/database/prisma/prisma.service.ts";
import { PrismaAdminsRepository } from "@/infra/database/prisma/repositories/prisma-admins-repository.ts";
import { PrismaAccountsRepository } from "./prisma/repositories/prisma-accounts-repository";
import { ScreeningFlowsRepository } from "@/domain/crm/application/repositories/screening-flows-repository";
import { PrismaScreeningFlowsRepository } from "./prisma/repositories/prisma-screening-flow-repository";
import { WorkspacesRepository } from "@/domain/crm/application/repositories/workspaces-repository";
import { PrismaWorkspacesRepository } from "./prisma/repositories/prisma-workspaces-repository";
import { LawyersRepository } from "@/domain/crm/application/repositories/lawyers-repository";
import { PrismaLawyersRepository } from "./prisma/repositories/prisma-lawyers-repository";
import { LeadsRepository } from "@/domain/crm/application/repositories/leads-repository";
import { PrismaLeadsRepository } from "./prisma/repositories/prisma-leads-repository";
import { AISessionRepository } from "@/domain/crm/application/repositories/ai-session-repository";
import { PrismaAISessionRepository } from "./prisma/repositories/prisma-ai-session-repository";

@Module({
  providers: [
    PrismaService,
    {
      provide: AdminsRepository,
      useClass: PrismaAdminsRepository,
    },
    {
      provide: AccountsRepository,
      useClass: PrismaAccountsRepository,
    },
    {
      provide: ScreeningFlowsRepository,
      useClass: PrismaScreeningFlowsRepository,
    },
    {
      provide: WorkspacesRepository,
      useClass: PrismaWorkspacesRepository,
    },
    {
      provide: LawyersRepository,
      useClass: PrismaLawyersRepository,
    },
    {
      provide: LeadsRepository,
      useClass: PrismaLeadsRepository,
    },
    {
      provide: AISessionRepository,
      useClass: PrismaAISessionRepository,
    }
  ],
  exports: [
    PrismaService,
    AdminsRepository,
    AccountsRepository,
    ScreeningFlowsRepository,
    WorkspacesRepository,
    LawyersRepository,
    LeadsRepository,
    AISessionRepository
  ],
})
export class DatabaseModule {}
