import { Either, right } from "@/core/either";
import { CaseAnalysis } from "@/domain/crm/enterprise/entities/case-analysis";
import { Inject, Injectable } from "@nestjs/common";
import { CaseAnalysisRepository } from "../../repositories/case-analysis-repository";


interface CreateCaseAnalysisUseCaseRequest {
    aiSessionId: string;
    leadId: string;
    title: string;
    viabilityLabel: string;
    analysisText: string;
    estimatedComplexity: string;
    mainLegalBase: string;
}

type CreateCaseAnalysisUseCaseResponse = Either<Error, { caseAnalysis: CaseAnalysis }>

@Injectable()
export class CreateCaseAnalysisUseCase {
    constructor(
        @Inject(CaseAnalysisRepository)
        private caseAnalysisRepository: CaseAnalysisRepository
    ) {}

    async execute(request: CreateCaseAnalysisUseCaseRequest): Promise<CreateCaseAnalysisUseCaseResponse> {
        const { aiSessionId, leadId, title, viabilityLabel, analysisText, estimatedComplexity, mainLegalBase } = request;

        const caseAnalysis = CaseAnalysis.create({
            aiSessionId,
            leadId,
            title,
            viabilityLabel,
            analysisText,
            estimatedComplexity,
            mainLegalBase,
        });

        await this.caseAnalysisRepository.create(caseAnalysis);

        return right({ caseAnalysis });
    }
}
