import {
  type Prisma,
  type User as PrismaAdmin,
  UserRole,
} from "generated/prisma/client";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Admin } from "@/domain/iam/enterprise/entities/admin";

export class PrismaAdminMapper {
  static toDomain(raw: PrismaAdmin): Admin {
    return Admin.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
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
    };
  }
}
