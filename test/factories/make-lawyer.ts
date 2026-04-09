import { faker } from "@faker-js/faker/locale/pt_BR";
import { Inject, Injectable } from "@nestjs/common";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import {
  Lawyer,
  type LawyerProps,
} from "@/domain/crm/enterprise/entities/lawyer";
import { PrismaLawyerMapper } from "@/infra/database/prisma/mappers/prisma-lawyer-mapper";

export function makeLawyer(
  override: Partial<LawyerProps> = {},
  id?: UniqueEntityID
) {
  const lawyer = Lawyer.create(
    {
      userId: new UniqueEntityID().toString(),
      workspaceId: "default-workspace",
      cellphone: faker.phone.number(),
      createdAt: new Date(),
      ...override,
    },
    id
  );

  return lawyer;
}

@Injectable()
export class LawyerFactory {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService
  ) {}

  async makePrismaLawyer(data: Partial<LawyerProps> = {}) {
    const lawyer = makeLawyer(data);

    await this.prisma.lawyer.create({
      data: PrismaLawyerMapper.toPrisma(lawyer),
    });

    return lawyer;
  }
}
