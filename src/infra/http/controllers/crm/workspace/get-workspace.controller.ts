import { WorkspaceDoesntExistError } from "@/domain/crm/application/use-cases/errors/workspace-doesnt-exist-error";
import { GetWorkspaceUseCase } from "@/domain/crm/application/use-cases/workspace/get-workspace";
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
      
      switch (error.constructor) {
        case WorkspaceDoesntExistError:
          throw new NotFoundException(error.message);
        default:
          throw new InternalServerErrorException(error.message);
      }
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
