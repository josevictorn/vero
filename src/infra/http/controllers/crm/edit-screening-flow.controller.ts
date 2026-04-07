import { EditScreeningFlowUseCase } from "@/domain/crm/application/use-cases/edit-screening-flow";
import { ScreeningFlowNotFoundError } from "@/domain/crm/application/use-cases/errors/screening-flow-not-found-error";
import { Body, Controller, HttpCode, Param, Put, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags, ApiParam } from "@nestjs/swagger";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";

const editScreeningFlowBodySchema = z.object({
  caseType: z.string(),
  questions: z.array(z.object({ question: z.string() }).loose()),
});

type EditScreeningFlowBodySchema = z.infer<typeof editScreeningFlowBodySchema>;

@ApiTags("Screening Flows")
@Controller("/screening-flows")
export class EditScreeningFlowController {
  constructor(private editScreeningFlow: EditScreeningFlowUseCase) {}

  @Put("/:id")
  @HttpCode(200)
  @ApiParam({ name: "id", type: "string" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        caseType: { type: "string" },
        questions: { type: "array" },
      },
    },
  })
  @ApiResponse({ status: 200, description: "Screening flow updated successfully" })
  @ApiResponse({ status: 404, description: "Screening flow not found" })
  async handle(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(editScreeningFlowBodySchema)) body: EditScreeningFlowBodySchema
  ) {
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
