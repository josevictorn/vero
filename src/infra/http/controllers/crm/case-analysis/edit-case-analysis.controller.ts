import { EditCaseAnalysisUseCase } from "@/domain/crm/application/use-cases/case-analysis/edit-case-analysis";
import { CaseAnalysisNotFoundError } from "@/domain/crm/application/use-cases/errors/case-analysis-not-found-error";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Controller, Inject, Put, HttpCode, Body, Param, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { ApiBody, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { z } from "zod";

const editCaseAnalysisParamsSchema = z.object({
    id: z.uuid(),
});

type EditCaseAnalysisParamsSchema = z.infer<typeof editCaseAnalysisParamsSchema>;

const editCaseAnalysisBodySchema = z.object({
    title: z.string(),
    viabilityLabel: z.string(),
    analysisText: z.string(),
    estimatedComplexity: z.string(),
    mainLegalBase: z.string(),
})

type EditCaseAnalysisBodySchema = z.infer<typeof editCaseAnalysisBodySchema>;

@ApiTags("Case Analysis")
@Controller("/case-analyses/:id")
export class EditCaseAnalysisController {
    constructor(
        @Inject(EditCaseAnalysisUseCase)
        private editCaseAnalysis: EditCaseAnalysisUseCase
    ) {}

    @Put()
    @HttpCode(200)
    @ApiParam({ name: "id", type: "string", example: "123e4567-e89b-12d3-a456-426614174000" })
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                title: { type: "string", example: "Análise Trabalhista - Horas Extras" },
                viabilityLabel: { type: "string", example: "Viável" },
                analysisText: { type: "string", example: "O cliente possui evidências suficientes para comprovar o trabalho em regime de horas extras." },
                estimatedComplexity: { type: "string", example: "Média" },
                mainLegalBase: { type: "string", example: "Art. 59 da CLT" },
            },
            required: ["title", "viabilityLabel", "analysisText", "estimatedComplexity", "mainLegalBase"],
        },
    })
    @ApiResponse({
        status: 200,
        description: "Case analysis updated successfully",
    })
    @ApiResponse({
        status: 404,
        description: "Case analysis not found",
    })
    async handle(
        @Param(new ZodValidationPipe(editCaseAnalysisParamsSchema)) params: EditCaseAnalysisParamsSchema,
        @Body(new ZodValidationPipe(editCaseAnalysisBodySchema)) body: EditCaseAnalysisBodySchema,
    ) {
        const { id } = params;
        const { title, viabilityLabel, analysisText, estimatedComplexity, mainLegalBase } = body;

        const result = await this.editCaseAnalysis.execute({
            id,
            title,
            viabilityLabel,
            analysisText,
            estimatedComplexity,
            mainLegalBase,
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