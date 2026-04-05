import { GetWorkspaceUseCase } from "@/domain/crm/application/use-cases/get-workspace";
import { Controller, Get, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Workspace")
@Controller("/workspace")
export class GetWorkspaceController {
  constructor(private getWorkspace: GetWorkspaceUseCase) {}

  @Get()
  @ApiResponse({ status: 200, description: "Workspace returned successfully" })
  @ApiResponse({ status: 404, description: "Workspace not seeded/found" })
  async handle() {
    const result = await this.getWorkspace.execute();

    if (result.isLeft()) {
      const error = result.value;
      if (error.message.includes("not found")) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }

    const { workspace } = result.value;

    return {
      workspace: {
        id: workspace.id.toString(),
        name: workspace.name,
        cnpj: workspace.cnpj,
        email: workspace.email,
        cellphone: workspace.cellphone,
        createdAt: workspace.createdAt,
      },
    };
  }
}
