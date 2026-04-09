import { GetByAISessionCaseAnalysisUseCase } from "@/domain/crm/application/use-cases/case-analysis/get-by-ai-session-case-analysis";
import { CaseAnalysisNotFoundError } from "@/domain/crm/application/use-cases/errors/case-analysis-not-found-error";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Controller, Inject, Get, HttpCode, Param, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { ApiTags, ApiParam, ApiResponse } from "@nestjs/swagger";
import { z } from "zod";


const getByAISessionCaseAnalysisParamsSchema = z.object({
    aiSessionId: z.uuid(),
});

type GetByAISessionCaseAnalysisParamsSchema = z.infer<typeof getByAISessionCaseAnalysisParamsSchema>;

@ApiTags("Case Analysis")
@Controller("/case-analyses/ai-session/:aiSessionId")
export class GetByAISessionCaseAnalysisController {
    constructor(
        @Inject(GetByAISessionCaseAnalysisUseCase)
        private getByAISessionCaseAnalysis: GetByAISessionCaseAnalysisUseCase
    ) {}

    @Get()
    @HttpCode(200)
    @ApiParam({
        name: "aiSessionId",
        description: "AI session ID",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @ApiResponse({
        status: 200,
        description: "Case analysis retrieved successfully",
    })
    @ApiResponse({
        status: 404,
        description: "Case analysis not found",
    })
    async handle(@Param(new ZodValidationPipe(getByAISessionCaseAnalysisParamsSchema)) params: GetByAISessionCaseAnalysisParamsSchema) {
        const { aiSessionId } = params;

        const result = await this.getByAISessionCaseAnalysis.execute({
            aiSessionId,
        });

        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case CaseAnalysisNotFoundError:
                    throw new NotFoundException(error.message);
                default:
                    throw new InternalServerErrorException(error.message);
            }
        }

        const { caseAnalysis } = result.value;

        return {
            caseAnalysis: {
                id: caseAnalysis.id.toString(),
                aiSessionId: caseAnalysis.aiSessionId,
                leadId: caseAnalysis.leadId,
                title: caseAnalysis.title,
                viabilityLabel: caseAnalysis.viabilityLabel,
                analysisText: caseAnalysis.analysisText,
                estimatedComplexity: caseAnalysis.estimatedComplexity,
                mainLegalBase: caseAnalysis.mainLegalBase,
                createdAt: caseAnalysis.createdAt,
            },
        };
    }
}