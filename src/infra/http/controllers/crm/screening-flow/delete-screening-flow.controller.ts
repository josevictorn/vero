import { DeleteScreeningFlowUseCase } from "@/domain/crm/application/use-cases/screening-flow/delete-screening-flow";
import { ScreeningFlowNotFoundError } from "@/domain/crm/application/use-cases/errors/screening-flow-not-found-error";
import { Controller, HttpCode, Inject, Param, Delete, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { ApiResponse, ApiTags, ApiParam } from "@nestjs/swagger";

@ApiTags("Screening Flows")
@Controller("/screening-flows")
export class DeleteScreeningFlowController {
  constructor(
    @Inject(DeleteScreeningFlowUseCase)
    private deleteScreeningFlow: DeleteScreeningFlowUseCase
  ) {}

  @Delete("/:id")
  @HttpCode(204)
  @ApiParam({ name: "id", type: "string" })
  @ApiResponse({ status: 204, description: "Screening flow deleted successfully" })
  @ApiResponse({ status: 404, description: "Screening flow not found" })
  async handle(@Param("id") id: string) {
    const result = await this.deleteScreeningFlow.execute({ id });

    if (result.isLeft()) {
      const error = result.value;
      
      switch (error.constructor) {
        case ScreeningFlowNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new InternalServerErrorException(error.message);
      }
    }
  }
}
