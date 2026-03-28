import { Injectable } from "@nestjs/common";
import type { AdminsRepository } from "@/domain/iam/application/repositories/admins-repository";
import type { Admin } from "@/domain/iam/enterprise/entities/admin";
import { PrismaAdminMapper } from "../mappers/prisma-admin-mapper";
import type { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaAdminsRepository implements AdminsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(Email: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: {
        email: Email,
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
