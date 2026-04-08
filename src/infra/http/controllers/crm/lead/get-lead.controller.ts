import { LeadNotFoundError } from "@/domain/crm/application/use-cases/errors/lead-not-found-error";
import { GetLeadUseCase } from "@/domain/crm/application/use-cases/lead/get-lead";
import { Controller, Get, Param, NotFoundException, InternalServerErrorException, Inject } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Leads")
@Controller("/leads/:id")
export class GetLeadController {
  constructor(
    @Inject(GetLeadUseCase)
    private getLead: GetLeadUseCase
  ) {}

  @Get()
  @ApiResponse({ status: 200, description: "Lead fetched successfully" })
  @ApiResponse({ status: 404, description: "Lead not found" })
  async handle(@Param("id") id: string) {
    const result = await this.getLead.execute({ id });

    if (result.isLeft()) {
      const error = result.value;
      
      switch (error.constructor) {
        case LeadNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new InternalServerErrorException(error.message);
      }
    }

    const { lead } = result.value;

    return {
      lead: {
        id: lead.id.toString(),
        workspaceId: lead.workspaceId,
        lawyerId: lead.lawyerId,
        name: lead.name,
        cellphone: lead.cellphone,
        email: lead.email,
        createdAt: lead.createdAt,
      },
    };
  }
}
