import { ScreeningFlowNotFoundError } from "@/domain/crm/application/use-cases/errors/screening-flow-not-found-error";
import { GetScreeningFlowUseCase } from "@/domain/crm/application/use-cases/screening-flow/get-screening-flow";
import { Controller, Get, Param, NotFoundException, InternalServerErrorException, Inject } from "@nestjs/common";
import { ApiResponse, ApiTags, ApiParam } from "@nestjs/swagger";
import { z } from "zod";
import { ZodValidationPipe } from "../../../pipes/zod-validation-pipe";

const getScreeningFlowParamsSchema = z.object({
  id: z.uuid(),
});

type GetScreeningFlowParamsSchema = z.infer<typeof getScreeningFlowParamsSchema>;

@ApiTags("Screening Flows")
@Controller("/screening-flows")
export class GetScreeningFlowController {
  constructor(
    @Inject(GetScreeningFlowUseCase)
    private getScreeningFlow: GetScreeningFlowUseCase
  ) {}

  @Get("/:id")
  @ApiParam({ name: "id", type: "string", example: "123e4567-e89b-12d3-a456-426614174000" })
  @ApiResponse({ status: 200, description: "Screening flow returned successfully" })
  @ApiResponse({ status: 404, description: "Screening flow not found" })
  async handle(@Param(new ZodValidationPipe(getScreeningFlowParamsSchema)) params: GetScreeningFlowParamsSchema) {
    const { id } = params;

    const result = await this.getScreeningFlow.execute({ id });

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
