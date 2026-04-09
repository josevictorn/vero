import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { CaseAnalysis } from "@/domain/crm/enterprise/entities/case-analysis";
import { CaseAnalysis as PrismaCaseAnalysis, Prisma } from "generated/prisma/client";


export class PrismaCaseAnalysisMapper {
    static toDomain(raw: PrismaCaseAnalysis): CaseAnalysis {
        return CaseAnalysis.create(
            {
                aiSessionId: raw.aiSessionId,
                leadId: raw.leadId,
                title: raw.title,
                viabilityLabel: raw.viabilityLabel,
                analysisText: raw.analysisText,
                estimatedComplexity: raw.estimatedComplexity,
                mainLegalBase: raw.mainLegalBase,
                createdAt: raw.createdAt,
            },
            new UniqueEntityID(raw.id)
        );
    }

    static toPrisma(caseAnalysis: CaseAnalysis): Prisma.CaseAnalysisUncheckedCreateInput {
        return {
            id: caseAnalysis.id.toString(),
            aiSessionId: caseAnalysis.aiSessionId,
            leadId: caseAnalysis.leadId,
            title: caseAnalysis.title,
            viabilityLabel: caseAnalysis.viabilityLabel,
            analysisText: caseAnalysis.analysisText,
            estimatedComplexity: caseAnalysis.estimatedComplexity,
            mainLegalBase: caseAnalysis.mainLegalBase,
            createdAt: caseAnalysis.createdAt,
        };
    }
}