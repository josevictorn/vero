import { faker } from "@faker-js/faker/locale/pt_BR";
import { Inject, Injectable } from "@nestjs/common";
import type { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import {
  ScreeningFlow,
  type ScreeningFlowProps,
} from "@/domain/crm/enterprise/entities/screening-flow";
import { PrismaScreeningFlowMapper } from "@/infra/database/prisma/mappers/prisma-screening-flow-mapper";

export function makeScreeningFlow(
  override: Partial<ScreeningFlowProps> = {},
  id?: UniqueEntityID
) {
  const screeningFlow = ScreeningFlow.create(
    {
      caseType: faker.lorem.word(),
      questions: [{ question: faker.lorem.sentence() }],
      createdAt: new Date(),
      ...override,
    },
    id
  );

  return screeningFlow;
}

@Injectable()
export class ScreeningFlowFactory {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService
  ) {}

  async makePrismaScreeningFlow(data: Partial<ScreeningFlowProps> = {}) {
    const screeningFlow = makeScreeningFlow(data);

    await this.prisma.screeningFlow.create({
      data: PrismaScreeningFlowMapper.toPrisma(screeningFlow),
    });

    return screeningFlow;
  }
}
