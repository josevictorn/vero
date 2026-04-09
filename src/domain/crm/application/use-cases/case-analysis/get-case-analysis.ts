import { Either, left, right } from "@/core/either";
import { CaseAnalysis } from "@/domain/crm/enterprise/entities/case-analysis";
import { Inject, Injectable } from "@nestjs/common";
import { CaseAnalysisRepository } from "../../repositories/case-analysis-repository";
import { CaseAnalysisNotFoundError } from "../errors/case-analysis-not-found-error";

interface GetCaseAnalysisUseCaseRequest {
    id: string;
}

type GetCaseAnalysisUseCaseResponse = Either<Error, { caseAnalysis: CaseAnalysis }>;

@Injectable()
export class GetCaseAnalysisUseCase {
    constructor(
        @Inject(CaseAnalysisRepository)
        private caseAnalysisRepository: CaseAnalysisRepository
    ) {}

    async execute(request: GetCaseAnalysisUseCaseRequest): Promise<GetCaseAnalysisUseCaseResponse> {
        const caseAnalysis = await this.caseAnalysisRepository.findById(request.id);

        if (!caseAnalysis) {
            return left(new CaseAnalysisNotFoundError());
        }

        return right({ caseAnalysis });
    }
}
