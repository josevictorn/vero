import { Either, left, right } from "@/core/either";
import { Injectable, Inject } from "@nestjs/common";
import { CaseAnalysis } from "@/domain/crm/enterprise/entities/case-analysis";
import { CaseAnalysisRepository } from "../../repositories/case-analysis-repository";
import { CaseAnalysisNotFoundError } from "../errors/case-analysis-not-found-error";


interface GetByAISessionCaseAnalysisUseCaseRequest {
    aiSessionId: string;
}

type GetByAISessionCaseAnalysisUseCaseResponse = Either<Error, { caseAnalysis: CaseAnalysis }>

@Injectable()
export class GetByAISessionCaseAnalysisUseCase {
    constructor(
        @Inject(CaseAnalysisRepository)
        private caseAnalysisRepository: CaseAnalysisRepository
    ) {}

    async execute(request: GetByAISessionCaseAnalysisUseCaseRequest): Promise<GetByAISessionCaseAnalysisUseCaseResponse> {
        const { aiSessionId } = request;

        const caseAnalysis = await this.caseAnalysisRepository.findByAiSessionId(aiSessionId);

        if (!caseAnalysis) {
            return left(new CaseAnalysisNotFoundError());
        }

        return right({ caseAnalysis });
    }
}