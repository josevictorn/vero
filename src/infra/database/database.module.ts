import { Module } from "@nestjs/common";
import { AdminsRepository } from "@/domain/iam/application/repositories/admins-repository";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaAdminsRepository } from "./prisma/repositories/prisma-admins-repository";

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
