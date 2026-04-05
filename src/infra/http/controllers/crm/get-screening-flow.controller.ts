import { GetScreeningFlowUseCase } from "@/domain/crm/application/use-cases/get-screening-flow";
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
      if (error.message.includes("not found")) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(error.message);
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
