import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Lawyer } from "@/domain/crm/enterprise/entities/lawyer";
import { LawyersRepository } from "@/domain/crm/application/repositories/lawyers-repository";
import { PrismaLawyerMapper } from "../mappers/prisma-lawyer-mapper";

@Injectable()
export class PrismaLawyersRepository implements LawyersRepository {
  constructor(private prisma: PrismaService) {}

  async create(lawyer: Lawyer): Promise<void> {
    const data = PrismaLawyerMapper.toPrisma(lawyer);

    await this.prisma.lawyer.create({
      data,
    });
  }

  async findById(id: string): Promise<Lawyer | null> {
    const lawyer = await this.prisma.lawyer.findUnique({
      where: {
        id,
      },
    });

    if (!lawyer) {
      return null;
    }

    return PrismaLawyerMapper.toDomain(lawyer);
  }

  async findByUserId(userId: string): Promise<Lawyer | null> {
    const lawyer = await this.prisma.lawyer.findUnique({
      where: {
        userId,
      },
    });

    if (!lawyer) {
      return null;
    }

    return PrismaLawyerMapper.toDomain(lawyer);
  }

  async findAll(): Promise<Lawyer[]> {
    const lawyers = await this.prisma.lawyer.findMany();

    return lawyers.map(PrismaLawyerMapper.toDomain);
  }

  async update(lawyer: Lawyer): Promise<void> {
    const data = PrismaLawyerMapper.toPrisma(lawyer);

    await this.prisma.lawyer.update({
      where: {
        id: lawyer.id.toString(),
      },
      data,
    });
  }

  async delete(lawyer: Lawyer): Promise<void> {
    await this.prisma.lawyer.delete({
      where: {
        id: lawyer.id.toString(),
      },
    });
  }
}
