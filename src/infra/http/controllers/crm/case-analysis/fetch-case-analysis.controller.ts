import { FetchCaseAnalysisUseCase } from "@/domain/crm/application/use-cases/case-analysis/fetch-case-analysis";
import { Controller, Get, HttpCode, Inject, InternalServerErrorException } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";


@Controller("/case-analyses")
export class FetchCaseAnalysisController {
    constructor(
        @Inject(FetchCaseAnalysisUseCase)
        private fetchCaseAnalysisUseCase: FetchCaseAnalysisUseCase
    ) {}

    @Get()
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: "Case analyses fetched successfully",
    })
    @ApiResponse({
        status: 500,
        description: "Internal server error",
    })
    async handle() {
        const result = await this.fetchCaseAnalysisUseCase.execute();

        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                default:
                    throw new InternalServerErrorException(error.message);
            }
        }

        const { caseAnalysis } = result.value;

        return {
            caseAnalysis: caseAnalysis.map((caseAnalysis) => ({
                id: caseAnalysis.id.toString(),
                aiSessionId: caseAnalysis.aiSessionId,
                leadId: caseAnalysis.leadId,
                title: caseAnalysis.title,
                viabilityLabel: caseAnalysis.viabilityLabel,
                analysisText: caseAnalysis.analysisText,
                estimatedComplexity: caseAnalysis.estimatedComplexity,
                mainLegalBase: caseAnalysis.mainLegalBase,
                createdAt: caseAnalysis.createdAt,
            })),
        };
    }
}