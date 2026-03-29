import type { Prisma, User as PrismaAccount } from "generated/prisma/client";
import { UniqueEntityID } from "@/core/entity/unique-entity-id.ts";
import { Account } from "@/domain/iam/enterprise/entities/account";

export class PrismaAccountMapper {
  static toDomain(raw: PrismaAccount): Account {
    return Account.create(
      {
        name: raw.name,
        email: raw.email,
        role: raw.role,
        password: raw.password,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(account: Account): Prisma.UserUncheckedCreateInput {
    return {
      id: account.id.toString(),
      name: account.name,
      role: account.role,
      email: account.email,
      password: account.password,
    };
  }
}
