import { ScreeningFlowNotFoundError } from "@/domain/crm/application/use-cases/errors/screening-flow-not-found-error";
import { GetScreeningFlowUseCase } from "@/domain/crm/application/use-cases/screening-flow/get-screening-flow";
import { Controller, Get, Param, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { ApiResponse, ApiTags, ApiParam } from "@nestjs/swagger";

@ApiTags("Screening Flows")
@Controller("/screening-flows")
export class GetScreeningFlowController {
  constructor(private getScreeningFlow: GetScreeningFlowUseCase) {}

  @Get("/:id")
  @ApiParam({ name: "id", type: "string" })
  @ApiResponse({ status: 200, description: "Screening flow returned successfully" })
  @ApiResponse({ status: 404, description: "Screening flow not found" })
  async handle(@Param("id") id: string) {
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
