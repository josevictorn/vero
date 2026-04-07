import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { ScreeningFlow } from "@/domain/crm/enterprise/entities/screening-flow";
import { ScreeningFlowsRepository } from "@/domain/crm/application/repositories/screening-flows-repository";
import { PrismaScreeningFlowMapper } from "../mappers/prisma-screening-flow-mapper";

@Injectable()
export class PrismaScreeningFlowsRepository implements ScreeningFlowsRepository {
    constructor(private prisma: PrismaService) {}

    async create(screeningFlow: ScreeningFlow): Promise<void> {
        const data = PrismaScreeningFlowMapper.toPrisma(screeningFlow);

        await this.prisma.screeningFlow.create({
            data,
        });
    }

    async update(screeningFlow: ScreeningFlow): Promise<void> {
        const data = PrismaScreeningFlowMapper.toPrisma(screeningFlow);

        await this.prisma.screeningFlow.update({
            where: {
                id: screeningFlow.id.toString(),
            },
            data,
        });
    }

    async delete(screeningFlow: ScreeningFlow): Promise<void> {
        await this.prisma.screeningFlow.delete({
            where: {
                id: screeningFlow.id.toString(),
            },
        });
    }

    async findById(id: string): Promise<ScreeningFlow | null> {
        const screeningFlow = await this.prisma.screeningFlow.findUnique({
            where: {
                id,
            },
        });

        if (!screeningFlow) {
            return null;
        }

        return PrismaScreeningFlowMapper.toDomain(screeningFlow);
    }

    async findAll(): Promise<ScreeningFlow[]> {
        const screeningFlows = await this.prisma.screeningFlow.findMany();

        return screeningFlows.map(PrismaScreeningFlowMapper.toDomain);
    }
}