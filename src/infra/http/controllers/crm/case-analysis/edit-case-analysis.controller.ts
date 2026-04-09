import { EditCaseAnalysisUseCase } from "@/domain/crm/application/use-cases/case-analysis/edit-case-analysis";
import { CaseAnalysisNotFoundError } from "@/domain/crm/application/use-cases/errors/case-analysis-not-found-error";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Controller, Inject, Put, HttpCode, Body, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { z } from "zod";

const editCaseAnalysisBodySchema = z.object({
    id: z.uuid(),
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
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                id: { type: "string", example: "123e4567-e89b-12d3-a456-426614174000" },
                title: { type: "string", example: "Case Analysis" },
                viabilityLabel: { type: "string", example: "Viable" },
                analysisText: { type: "string", example: "Analysis Text" },
                estimatedComplexity: { type: "string", example: "Medium" },
                mainLegalBase: { type: "string", example: "Main Legal Base" },
            },
            required: ["id", "title", "viabilityLabel", "analysisText", "estimatedComplexity", "mainLegalBase"],
        },
    })
    @ApiResponse({
        status: 200,
        description: "Case analysis updated successfully",
    })
    @ApiResponse({
        status: 400,
        description: "Validation failed or other bad request error",
    })
    async handle(@Body(new ZodValidationPipe(editCaseAnalysisBodySchema)) body: EditCaseAnalysisBodySchema) {
        const { id, title, viabilityLabel, analysisText, estimatedComplexity, mainLegalBase } = body;

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