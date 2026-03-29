import { faker } from "@faker-js/faker/locale/pt_BR";
import { Inject, Injectable } from "@nestjs/common";
import type { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Admin, type AdminProps } from "@/domain/iam/enterprise/entities/admin";
import { PrismaAdminMapper } from "@/infra/database/prisma/mappers/prisma-admin-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

export function makeAdmin(
  override: Partial<AdminProps> = {},
  id?: UniqueEntityID
) {
  const admin = Admin.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id
  );

  return admin;
}

@Injectable()
export class AdminFactory {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService
  ) {}

  async makePrismaAdmin(data: Partial<AdminProps> = {}) {
    const admin = makeAdmin(data);

    await this.prisma.user.create({
      data: PrismaAdminMapper.toPrisma(admin),
    });

    return admin;
  }
}
