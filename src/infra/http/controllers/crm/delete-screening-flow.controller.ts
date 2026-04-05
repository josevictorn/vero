import { DeleteScreeningFlowUseCase } from "@/domain/crm/application/use-cases/delete-screening-flow";
import { Controller, HttpCode, Param, Delete, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { ApiResponse, ApiTags, ApiParam } from "@nestjs/swagger";

@ApiTags("Screening Flows")
@Controller("/screening-flows")
export class DeleteScreeningFlowController {
  constructor(private deleteScreeningFlow: DeleteScreeningFlowUseCase) {}

  @Delete("/:id")
  @HttpCode(204)
  @ApiParam({ name: "id", type: "string" })
  @ApiResponse({ status: 204, description: "Screening flow deleted successfully" })
  @ApiResponse({ status: 404, description: "Screening flow not found" })
  async handle(@Param("id") id: string) {
    const result = await this.deleteScreeningFlow.execute({ id });

    if (result.isLeft()) {
      const error = result.value;
      if (error.message.includes("not found")) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
