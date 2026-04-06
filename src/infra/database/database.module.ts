import { Module } from "@nestjs/common";
import { AccountsRepository } from "@/domain/iam/application/repositories/accounts-repository";
import { AdminsRepository } from "@/domain/iam/application/repositories/admins-repository.ts";
import { PrismaService } from "@/infra/database/prisma/prisma.service.ts";
import { PrismaAdminsRepository } from "@/infra/database/prisma/repositories/prisma-admins-repository.ts";
import { PrismaAccountsRepository } from "./prisma/repositories/prisma-accounts-repository";
import { ScreeningFlowRepository } from "@/domain/crm/application/repositories/screening-flow-repository";
import { PrismaScreeningFlowRepository } from "./prisma/repositories/prisma-screening-flow-repository";
import { WorkspacesRepository } from "@/domain/crm/application/repositories/workspaces-repository";
import { PrismaWorkspacesRepository } from "./prisma/repositories/prisma-workspaces-repository";
import { LawyersRepository } from "@/domain/crm/application/repositories/lawyers-repository";
import { PrismaLawyersRepository } from "./prisma/repositories/prisma-lawyers-repository";

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
      provide: ScreeningFlowRepository,
      useClass: PrismaScreeningFlowRepository,
    },
    {
      provide: WorkspacesRepository,
      useClass: PrismaWorkspacesRepository,
    },
    {
      provide: LawyersRepository,
      useClass: PrismaLawyersRepository,
    },
  ],
  exports: [
    PrismaService,
    AdminsRepository,
    AccountsRepository,
    ScreeningFlowRepository,
    WorkspacesRepository,
    LawyersRepository,
  ],
})
export class DatabaseModule {}
