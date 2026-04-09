import { Either, left, right } from "@/core/either";
import { Injectable, Inject } from "@nestjs/common";
import { CaseAnalysis } from "@/domain/crm/enterprise/entities/case-analysis";
import { CaseAnalysisRepository } from "../../repositories/case-analysis-repository";
import { CaseAnalysisNotFoundError } from "../errors/case-analysis-not-found-error";


interface EditCaseAnalysisUseCaseRequest {
    id: string;
    title: string;
    viabilityLabel: string;
    analysisText: string;
    estimatedComplexity: string;
    mainLegalBase: string;
}

type EditCaseAnalysisUseCaseResponse = Either<Error, { caseAnalysis: CaseAnalysis }>

@Injectable()
export class EditCaseAnalysisUseCase {
    constructor(
        @Inject(CaseAnalysisRepository)
        private caseAnalysisRepository: CaseAnalysisRepository
    ) {}

    async execute(request: EditCaseAnalysisUseCaseRequest): Promise<EditCaseAnalysisUseCaseResponse> {
        const { id, title, viabilityLabel, analysisText, estimatedComplexity, mainLegalBase } = request;

        const caseAnalysis = await this.caseAnalysisRepository.findById(id);

        if (!caseAnalysis) {
            return left(new CaseAnalysisNotFoundError());
        }

        caseAnalysis.title = title;
        caseAnalysis.viabilityLabel = viabilityLabel;
        caseAnalysis.analysisText = analysisText;
        caseAnalysis.estimatedComplexity = estimatedComplexity;
        caseAnalysis.mainLegalBase = mainLegalBase;

        await this.caseAnalysisRepository.update(caseAnalysis);

        return right({ caseAnalysis });
    }
}