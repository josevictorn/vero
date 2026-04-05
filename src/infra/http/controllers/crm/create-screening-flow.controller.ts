import { CreateScreeningFlowUseCase } from "@/domain/crm/application/use-cases/create-screening-flow";
import { Body, Controller, HttpCode, InternalServerErrorException, Post } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { z } from "zod";

const createScreeningFlowBodySchema = z.object({
  caseType: z.string(),
  questions: z.any(),
});

type CreateScreeningFlowBodySchema = z.infer<typeof createScreeningFlowBodySchema>;

@ApiTags("Screening Flows")
@Controller("/screening-flows")
export class CreateScreeningFlowController {
  constructor(private createScreeningFlow: CreateScreeningFlowUseCase) {}

  @Post()
  @HttpCode(201)
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        caseType: { type: "string", example: "Trabalhista" },
        questions: {
          type: "array",
          example: [{ text: "Trabalhava aos domingos?", type: "boolean" }],
        },
      },
      required: ["caseType", "questions"],
    },
  })
  @ApiResponse({
    status: 201,
    description: "Screening flow created successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Validation failed or other bad request error",
  })
  async handle(@Body() body: CreateScreeningFlowBodySchema) {
    const { caseType, questions } = body;

    const result = await this.createScreeningFlow.execute({
      caseType,
      questions,
    });

    if (result.isLeft()) {
      throw new InternalServerErrorException("Unexpected error when creating screening flow.");
    }

    const { screeningFlow } = result.value;

    return {
      screeningFlow: {
        id: screeningFlow.id.toString(),
        caseType: screeningFlow.caseType,
        questions: screeningFlow.questions,
        createdAt: screeningFlow.createdAt,
      },
    };
  }
}