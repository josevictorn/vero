import { DeleteLeadUseCase } from "@/domain/crm/application/use-cases/delete-lead";
import { LeadNotFoundError } from "@/domain/crm/application/use-cases/errors/lead-not-found-error";
import { Controller, HttpCode, Delete, Param, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Leads")
@Controller("/leads/:id")
export class DeleteLeadController {
  constructor(private deleteLead: DeleteLeadUseCase) {}

  @Delete()
  @HttpCode(204)
  @ApiResponse({ status: 204, description: "Lead deleted successfully" })
  @ApiResponse({ status: 404, description: "Lead not found" })
  async handle(@Param("id") id: string) {
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
