import { Module } from "@nestjs/common";
import { AccountsRepository } from "@/domain/iam/application/repositories/accounts-repository";
import { AdminsRepository } from "@/domain/iam/application/repositories/admins-repository.ts";
import { PrismaService } from "@/infra/database/prisma/prisma.service.ts";
import { PrismaAdminsRepository } from "@/infra/database/prisma/repositories/prisma-admins-repository.ts";
import { PrismaAccountsRepository } from "./prisma/repositories/prisma-accounts-repository";

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
  ],
  exports: [PrismaService, AdminsRepository, AccountsRepository],
})
export class DatabaseModule {}
