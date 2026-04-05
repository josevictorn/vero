import { faker } from "@faker-js/faker/locale/pt_BR";
import { Inject, Injectable } from "@nestjs/common";
import type { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import {
  Workspace,
  type WorkspaceProps,
} from "@/domain/crm/enterprise/entities/workspace";
import { PrismaWorkspaceMapper } from "@/infra/database/prisma/mappers/prisma-workspace-mapper";

export function makeWorkspace(
  override: Partial<WorkspaceProps> = {},
  id?: UniqueEntityID
) {
  const workspace = Workspace.create(
    {
      name: faker.company.name(),
      cnpj: faker.string.numeric(14),
      email: faker.internet.email(),
      cellphone: faker.phone.number(),
      createdAt: new Date(),
      ...override,
    },
    id
  );

  return workspace;
}

@Injectable()
export class WorkspaceFactory {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService
  ) {}

  async makePrismaWorkspace(data: Partial<WorkspaceProps> = {}) {
    const workspace = makeWorkspace(data);

    await this.prisma.workspace.create({
      data: PrismaWorkspaceMapper.toPrisma(workspace),
    });

    return workspace;
  }
}
