import { Either, left, right } from "@/core/either";
import { Inject, Injectable } from "@nestjs/common";
import { CaseAnalysisRepository } from "../../repositories/case-analysis-repository";
import { CaseAnalysisNotFoundError } from "../errors/case-analysis-not-found-error";


interface DeleteCaseAnalysisUseCaseRequest {
    id: string;
}

type DeleteCaseAnalysisUseCaseResponse = Either<Error, {}>;

@Injectable()
export class DeleteCaseAnalysisUseCase {
    constructor(
        @Inject(CaseAnalysisRepository)
        private caseAnalysisRepository: CaseAnalysisRepository
    ) {}

    async execute(request: DeleteCaseAnalysisUseCaseRequest): Promise<DeleteCaseAnalysisUseCaseResponse> {
        const caseAnalysis = await this.caseAnalysisRepository.findById(request.id);

        if (!caseAnalysis) {
            return left(new CaseAnalysisNotFoundError());
        }

        await this.caseAnalysisRepository.delete(caseAnalysis);

        return right({});
    }
}