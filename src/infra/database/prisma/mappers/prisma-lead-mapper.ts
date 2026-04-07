import { Lead as PrismaLead, Prisma } from "generated/prisma/client";
import { UniqueEntityID } from "@/core/entity/unique-entity-id.ts";
import { Lead } from "@/domain/crm/enterprise/entities/lead";

export class PrismaLeadMapper {
  static toDomain(raw: PrismaLead): Lead {
    return Lead.create(
      {
        workspaceId: raw.workspaceId,
        lawyerId: raw.lawyerId,
        name: raw.name,
        cellphone: raw.cellphone,
        email: raw.email,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(lead: Lead): Prisma.LeadUncheckedCreateInput {
    return {
      id: lead.id.toString(),
      workspaceId: lead.workspaceId,
      lawyerId: lead.lawyerId,
      name: lead.name,
      cellphone: lead.cellphone,
      email: lead.email,
      createdAt: lead.createdAt,
    };
  }
}
