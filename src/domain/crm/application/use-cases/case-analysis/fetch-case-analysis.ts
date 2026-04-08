import { Either, right } from "@/core/either";
import { Inject, Injectable } from "@nestjs/common";
import { CaseAnalysisRepository } from "../../repositories/case-analysis-repository";
import { CaseAnalysis } from "@/domain/crm/enterprise/entities/case-analysis";



type FetchCaseAnalysisUseCaseResponse = Either<Error, { caseAnalysis: CaseAnalysis[] }>

@Injectable()
export class FetchCaseAnalysisUseCase {
    constructor(
        @Inject(CaseAnalysisRepository)
        private caseAnalysisRepository: CaseAnalysisRepository
    ) {}

    async execute(): Promise<FetchCaseAnalysisUseCaseResponse> {
        const caseAnalysis = await this.caseAnalysisRepository.findAll();

        return right({ caseAnalysis });
    }
}