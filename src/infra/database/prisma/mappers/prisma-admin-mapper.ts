import type { Prisma, User as PrismaAdmin } from "generated/prisma/client";
import { UniqueEntityID } from "@/core/entity/unique-entity-id.ts";
import { Admin } from "@/domain/iam/enterprise/entities/admin.ts";
import { UserRole } from "@/domain/iam/enterprise/entities/value-objects/user-role";

export class PrismaAdminMapper {
  static toDomain(raw: PrismaAdmin): Admin {
    return Admin.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        role: raw.role as UserRole,
        isActive: raw.isActive,
        createdAt: raw.createdAt.toISOString(),
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(admin: Admin): Prisma.UserUncheckedCreateInput {
    return {
      id: admin.id.toString(),
      name: admin.name,
      role: UserRole.ADMIN,
      email: admin.email,
      password: admin.password,
      isActive: admin.isActive,
      createdAt: new Date(admin.createdAt),
    };
  }
}
