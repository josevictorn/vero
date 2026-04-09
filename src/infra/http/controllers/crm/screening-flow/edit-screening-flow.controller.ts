import { EditScreeningFlowUseCase } from "@/domain/crm/application/use-cases/screening-flow/edit-screening-flow";
import { ScreeningFlowNotFoundError } from "@/domain/crm/application/use-cases/errors/screening-flow-not-found-error";
import { Body, Controller, HttpCode, Inject, Param, Put, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags, ApiParam } from "@nestjs/swagger";
import { z } from "zod";
import { ZodValidationPipe } from "../../../pipes/zod-validation-pipe";

const editScreeningFlowParamsSchema = z.object({
  id: z.uuid(),
});

type EditScreeningFlowParamsSchema = z.infer<typeof editScreeningFlowParamsSchema>;

const editScreeningFlowBodySchema = z.object({
  caseType: z.string(),
  questions: z.array(z.object({ question: z.string() }).loose()),
});

type EditScreeningFlowBodySchema = z.infer<typeof editScreeningFlowBodySchema>;

@ApiTags("Screening Flows")
@Controller("/screening-flows")
export class EditScreeningFlowController {
  constructor(
    @Inject(EditScreeningFlowUseCase)
    private editScreeningFlow: EditScreeningFlowUseCase
  ) {}

  @Put("/:id")
  @HttpCode(200)
  @ApiParam({ name: "id", type: "string", example: "123e4567-e89b-12d3-a456-426614174000" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        caseType: { type: "string", example: "Trabalhista" },
        questions: {
          type: "array",
          example: [{ question: "Trabalhava aos domingos?", type: "boolean" }],
        },
      },
      required: ["caseType", "questions"],
    },
  })
  @ApiResponse({ status: 200, description: "Screening flow updated successfully" })
  @ApiResponse({ status: 404, description: "Screening flow not found" })
  async handle(
    @Param(new ZodValidationPipe(editScreeningFlowParamsSchema)) params: EditScreeningFlowParamsSchema,
    @Body(new ZodValidationPipe(editScreeningFlowBodySchema)) body: EditScreeningFlowBodySchema,
  ) {
    const { id } = params;
    const { caseType, questions } = body;

    const result = await this.editScreeningFlow.execute({
      id,
      caseType,
      questions,
    });

    if (result.isLeft()) {
      const error = result.value;
      
      switch (error.constructor) {
        case ScreeningFlowNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new InternalServerErrorException(error.message);
      }
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
