import { faker } from "@faker-js/faker/locale/pt_BR";
import { Inject, Injectable } from "@nestjs/common";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Lead, type LeadProps } from "@/domain/crm/enterprise/entities/lead";
import { PrismaLeadMapper } from "@/infra/database/prisma/mappers/prisma-lead-mapper";

export function makeLead(override: Partial<LeadProps> = {}, id?: UniqueEntityID) {
  const lead = Lead.create(
    {
      workspaceId: "default-workspace",
      lawyerId: null,
      name: faker.person.fullName(),
      cellphone: faker.phone.number(),
      email: faker.internet.email(),
      createdAt: new Date(),
      ...override,
    },
    id
  );

  return lead;
}

@Injectable()
export class LeadFactory {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService
  ) {}

  async makePrismaLead(data: Partial<LeadProps & { id: string }> = {}) {
    const { id, ...override } = data as any;
    
    const lead = makeLead(override, id ? new UniqueEntityID(id) : undefined);

    await this.prisma.lead.create({
      data: PrismaLeadMapper.toPrisma(lead),
    });

    return lead;
  }
}
