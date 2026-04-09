import { CaseAnalysisRepository } from "@/domain/crm/application/repositories/case-analysis-repository";
import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CaseAnalysis } from "@/domain/crm/enterprise/entities/case-analysis";
import { PrismaCaseAnalysisMapper } from "../mappers/prisma-case-analysis-mapper";


@Injectable()
export class PrismaCaseAnalysisRepository implements CaseAnalysisRepository {
    constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

    async create(caseAnalysis: CaseAnalysis): Promise<void> {
        const data = PrismaCaseAnalysisMapper.toPrisma(caseAnalysis);

        await this.prisma.caseAnalysis.create({
            data,
        });
    }

    async findById(id: string): Promise<CaseAnalysis | null> {
        const caseAnalysis = await this.prisma.caseAnalysis.findUnique({
            where: {
                id,
            },
        });

        if (!caseAnalysis) {
            return null;
        }

        return PrismaCaseAnalysisMapper.toDomain(caseAnalysis);
    }

    async findAll(): Promise<CaseAnalysis[]> {
        const caseAnalyses = await this.prisma.caseAnalysis.findMany();

        return caseAnalyses.map(PrismaCaseAnalysisMapper.toDomain);
    }

    async update(caseAnalysis: CaseAnalysis): Promise<void> {
        const data = PrismaCaseAnalysisMapper.toPrisma(caseAnalysis);

        await this.prisma.caseAnalysis.update({
            where: {
                id: caseAnalysis.id.toString(),
            },
            data,
        });
    }

    async delete(caseAnalysis: CaseAnalysis): Promise<void> {
        await this.prisma.caseAnalysis.delete({
            where: {
                id: caseAnalysis.id.toString(),
            },
        });
    }

    async findByAiSessionId(aiSessionId: string): Promise<CaseAnalysis | null> {
        const caseAnalysis = await this.prisma.caseAnalysis.findFirst({
            where: {
                aiSessionId,
            },
        });

        if (!caseAnalysis) {
            return null;
        }

        return PrismaCaseAnalysisMapper.toDomain(caseAnalysis);
    }
}