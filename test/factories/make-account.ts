import { faker } from "@faker-js/faker/locale/pt_BR";
import { Inject, Injectable } from "@nestjs/common";
import { UserRole } from "generated/prisma/client";
import type { UniqueEntityID } from "@/core/entity/unique-entity-id";
import {
  Account,
  type AccountProps,
} from "@/domain/iam/enterprise/entities/account";
import { PrismaAdminMapper } from "@/infra/database/prisma/mappers/prisma-admin-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

function randomUserRole(): UserRole {
  const roles = Object.values(UserRole);
  return faker.helpers.arrayElement(roles);
}

export function makeAccount(
  override: Partial<AccountProps> = {},
  id?: UniqueEntityID
) {
  const account = Account.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: randomUserRole(),
      password: faker.internet.password(),
      ...override,
    },
    id
  );

  return account;
}

@Injectable()
export class AccountFactory {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService
  ) {}

  async makePrismaAccount(data: Partial<AccountProps> = {}) {
    const account = makeAccount(data);

    await this.prisma.user.create({
      data: PrismaAdminMapper.toPrisma(account),
    });

    return account;
  }
}
