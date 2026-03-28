import { Module } from "@nestjs/common";
import { AdminsRepository } from "@/domain/iam/application/repositories/admins-repository.ts";
import { PrismaService } from "@/infra/database/prisma/prisma.service.ts";
import { PrismaAdminsRepository } from "@/infra/database/prisma/repositories/prisma-admins-repository.ts";

@Module({
  providers: [
    PrismaService,
    {
      provide: AdminsRepository,
      useClass: PrismaAdminsRepository,
    },
  ],
  exports: [PrismaService, AdminsRepository],
})
export class DatabaseModule {}
