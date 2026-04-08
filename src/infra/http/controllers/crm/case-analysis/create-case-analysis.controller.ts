import { CreateCaseAnalysisUseCase } from "@/domain/crm/application/use-cases/case-analysis/create-case-analysis";
import { CaseAnalysisAlreadyExistsError } from "@/domain/crm/application/use-cases/errors/case-analysis-already-exists-error";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Body, ConflictException, Controller, HttpCode, InternalServerErrorException, Post } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { z } from "zod";


const createCaseAnalysisBodySchema = z.object({
    aiSessionId: z.string(),
    leadId: z.string(),
    title: z.string(),
    viabilityLabel: z.string(),
    analysisText: z.string(),
    estimatedComplexity: z.string(),
    mainLegalBase: z.string(),
})

type CreateCaseAnalysisBodySchema = z.infer<typeof createCaseAnalysisBodySchema>;

@ApiTags("Case Analysis")
@Controller("/case-analyses")
export class CreateCaseAnalysisController {
    constructor(
        private createCaseAnalysis: CreateCaseAnalysisUseCase
    ) {}

    @Post()
    @HttpCode(201)
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                aiSessionId: { type: "string", example: "123e4567-e89b-12d3-a456-426614174000" },
                leadId: { type: "string", example: "123e4567-e89b-12d3-a456-426614174000" },
                title: { type: "string", example: "Case Analysis" },
                viabilityLabel: { type: "string", example: "Viable" },
                analysisText: { type: "string", example: "Analysis Text" },
                estimatedComplexity: { type: "string", example: "Medium" },
                mainLegalBase: { type: "string", example: "Main Legal Base" },
            },
            required: ["aiSessionId", "leadId", "title", "viabilityLabel", "analysisText", "estimatedComplexity", "mainLegalBase"],
        },
    })
    @ApiResponse({
        status: 201,
        description: "Case analysis created successfully",
    })
    @ApiResponse({
        status: 400,
        description: "Validation failed or other bad request error",
    })
    async handle(@Body(new ZodValidationPipe(createCaseAnalysisBodySchema)) body: CreateCaseAnalysisBodySchema) {
        const { aiSessionId, leadId, title, viabilityLabel, analysisText, estimatedComplexity, mainLegalBase } = body;

        const result = await this.createCaseAnalysis.execute({
            aiSessionId,
            leadId,
            title,
            viabilityLabel,
            analysisText,
            estimatedComplexity,
            mainLegalBase,
        });

        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case CaseAnalysisAlreadyExistsError:
                    throw new ConflictException(error.message);
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