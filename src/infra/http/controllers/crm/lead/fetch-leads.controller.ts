import { FetchLeadsUseCase } from "@/domain/crm/application/use-cases/lead/fetch-leads";
import { Controller, Get, Inject, InternalServerErrorException } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Leads")
@Controller("/leads")
export class FetchLeadsController {
  constructor(
    @Inject(FetchLeadsUseCase)
    private fetchLeads: FetchLeadsUseCase
  ) {}

  @Get()
  @ApiResponse({ status: 200, description: "List of leads in the workspace" })
  async handle() {
    const result = await this.fetchLeads.execute();

    if (result.isLeft()) {
      throw new InternalServerErrorException("Unknown error occurred");
    }

    const { leads } = result.value;

    return {
      leads: leads.map((lead) => ({
        id: lead.id.toString(),
        workspaceId: lead.workspaceId,
        lawyerId: lead.lawyerId,
        name: lead.name,
        cellphone: lead.cellphone,
        email: lead.email,
        createdAt: lead.createdAt,
      })),
    };
  }
}
