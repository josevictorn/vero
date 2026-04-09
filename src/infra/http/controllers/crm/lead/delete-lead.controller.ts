import { DeleteLeadUseCase } from "@/domain/crm/application/use-cases/lead/delete-lead";
import { LeadNotFoundError } from "@/domain/crm/application/use-cases/errors/lead-not-found-error";
import { Controller, HttpCode, Delete, Param, NotFoundException, InternalServerErrorException, Inject } from "@nestjs/common";
import { ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { z } from "zod";
import { ZodValidationPipe } from "../../../pipes/zod-validation-pipe";

const deleteLeadParamsSchema = z.object({
  id: z.uuid(),
});

type DeleteLeadParamsSchema = z.infer<typeof deleteLeadParamsSchema>;

@ApiTags("Leads")
@Controller("/leads/:id")
export class DeleteLeadController {
  constructor(
    @Inject(DeleteLeadUseCase)
    private deleteLead: DeleteLeadUseCase
  ) {}

  @Delete()
  @HttpCode(204)
  @ApiParam({ name: "id", type: "string", example: "123e4567-e89b-12d3-a456-426614174000" })
  @ApiResponse({ status: 204, description: "Lead deleted successfully" })
  @ApiResponse({ status: 404, description: "Lead not found" })
  async handle(@Param(new ZodValidationPipe(deleteLeadParamsSchema)) params: DeleteLeadParamsSchema) {
    const { id } = params;

    const result = await this.deleteLead.execute({ id });

    if (result.isLeft()) {
      const error = result.value;
      
      switch (error.constructor) {
        case LeadNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new InternalServerErrorException(error.message);
      }
    }
  }
}
