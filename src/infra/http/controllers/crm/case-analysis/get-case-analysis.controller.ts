import { GetCaseAnalysisUseCase } from "@/domain/crm/application/use-cases/case-analysis/get-case-analysis";
import { CaseAnalysisNotFoundError } from "@/domain/crm/application/use-cases/errors/case-analysis-not-found-error";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Controller, Get, HttpCode, Inject, InternalServerErrorException, NotFoundException, Param } from "@nestjs/common";
import { ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { z } from "zod";


const getCaseAnalysisParamsSchema = z.object({
    id: z.uuid(),
});

type GetCaseAnalysisParamsSchema = z.infer<typeof getCaseAnalysisParamsSchema>;

@ApiTags("Case Analysis")
@Controller("/case-analyses/:id")
export class GetCaseAnalysisController {
    constructor(
        @Inject(GetCaseAnalysisUseCase)
        private getCaseAnalysis: GetCaseAnalysisUseCase
    ) {}

    @Get()
    @HttpCode(200)
    @ApiParam({
        name: "id",
        description: "Case analysis ID",
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
    async handle(@Param(new ZodValidationPipe(getCaseAnalysisParamsSchema)) params: GetCaseAnalysisParamsSchema) {
        const { id } = params;

        const result = await this.getCaseAnalysis.execute({
            id,
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