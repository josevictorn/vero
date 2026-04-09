import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Lead } from "@/domain/crm/enterprise/entities/lead";
import { LeadsRepository } from "@/domain/crm/application/repositories/leads-repository";
import { PrismaLeadMapper } from "../mappers/prisma-lead-mapper";

@Injectable()
export class PrismaLeadsRepository implements LeadsRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async create(lead: Lead): Promise<void> {
    const data = PrismaLeadMapper.toPrisma(lead);

    await this.prisma.lead.create({
      data,
    });
  }

  async findById(id: string): Promise<Lead | null> {
    const lead = await this.prisma.lead.findUnique({
      where: {
        id,
      },
    });

    if (!lead) {
      return null;
    }

    return PrismaLeadMapper.toDomain(lead);
  }

  async findByLawyerId(lawyerId: string): Promise<Lead[]> {
    const leads = await this.prisma.lead.findMany({
      where: {
        lawyerId,
      },
    });

    return leads.map(PrismaLeadMapper.toDomain);
  }

  async findAll(): Promise<Lead[]> {
    const leads = await this.prisma.lead.findMany();

    return leads.map(PrismaLeadMapper.toDomain);
  }

  async update(lead: Lead): Promise<void> {
    const data = PrismaLeadMapper.toPrisma(lead);

    await this.prisma.lead.update({
      where: {
        id: lead.id.toString(),
      },
      data,
    });
  }

  async delete(lead: Lead): Promise<void> {
    await this.prisma.lead.delete({
      where: {
        id: lead.id.toString(),
      },
    });
  }
}
