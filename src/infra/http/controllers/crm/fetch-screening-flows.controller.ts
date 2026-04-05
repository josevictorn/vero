import { FetchScreeningFlowsUseCase } from "@/domain/crm/application/use-cases/fetch-screening-flows";
import { Controller, Get, InternalServerErrorException } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Screening Flows")
@Controller("/screening-flows")
export class FetchScreeningFlowsController {
  constructor(private fetchScreeningFlows: FetchScreeningFlowsUseCase) {}

  @Get()
  @ApiResponse({ status: 200, description: "List of screening flows" })
  async handle() {
    const result = await this.fetchScreeningFlows.execute();

    if (result.isLeft()) {
      throw new InternalServerErrorException("Unexpected error when fetching screening flows.");
    }

    const { screeningFlows } = result.value;

    return {
      screeningFlows: screeningFlows.map((flow) => ({
        id: flow.id.toString(),
        caseType: flow.caseType,
        questions: flow.questions,
        createdAt: flow.createdAt,
      })),
    };
  }
}
