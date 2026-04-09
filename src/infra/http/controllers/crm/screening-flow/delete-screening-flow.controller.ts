import { DeleteScreeningFlowUseCase } from "@/domain/crm/application/use-cases/screening-flow/delete-screening-flow";
import { ScreeningFlowNotFoundError } from "@/domain/crm/application/use-cases/errors/screening-flow-not-found-error";
import { Controller, HttpCode, Inject, Param, Delete, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { ApiResponse, ApiTags, ApiParam } from "@nestjs/swagger";
import { z } from "zod";
import { ZodValidationPipe } from "../../../pipes/zod-validation-pipe";

const deleteScreeningFlowParamsSchema = z.object({
  id: z.uuid(),
});

type DeleteScreeningFlowParamsSchema = z.infer<typeof deleteScreeningFlowParamsSchema>;

@ApiTags("Screening Flows")
@Controller("/screening-flows")
export class DeleteScreeningFlowController {
  constructor(
    @Inject(DeleteScreeningFlowUseCase)
    private deleteScreeningFlow: DeleteScreeningFlowUseCase
  ) {}

  @Delete("/:id")
  @HttpCode(204)
  @ApiParam({ name: "id", type: "string", example: "123e4567-e89b-12d3-a456-426614174000" })
  @ApiResponse({ status: 204, description: "Screening flow deleted successfully" })
  @ApiResponse({ status: 404, description: "Screening flow not found" })
  async handle(@Param(new ZodValidationPipe(deleteScreeningFlowParamsSchema)) params: DeleteScreeningFlowParamsSchema) {
    const { id } = params;

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
