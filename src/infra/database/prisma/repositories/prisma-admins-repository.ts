import { Inject, Injectable } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import type { AdminsRepository } from "@/domain/iam/application/repositories/admins-repository.ts";
import type { Admin } from "@/domain/iam/enterprise/entities/admin.ts";
import { PrismaAdminMapper } from "@/infra/database/prisma/mappers/prisma-admin-mapper.ts";
import { PrismaService } from "@/infra/database/prisma/prisma.service.ts";

@Injectable()
export class PrismaAdminsRepository implements AdminsRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async findByEmail(Email: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: {
        email: Email,
        role: UserRole.ADMIN,
      },
    });

    if (!admin) {
      return null;
    }

    return PrismaAdminMapper.toDomain(admin);
  }

  async create(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(admin);

    await this.prisma.user.create({
      data,
    });
  }
}
