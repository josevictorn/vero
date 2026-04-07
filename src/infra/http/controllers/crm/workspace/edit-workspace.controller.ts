import { EditWorkspaceUseCase } from "@/domain/crm/application/use-cases/workspace/edit-workspace";
import { WorkspaceDoesntExistError } from "@/domain/crm/application/use-cases/errors/workspace-doesnt-exist-error";
import { Body, Controller, HttpCode, Put, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { z } from "zod";
import { ZodValidationPipe } from "../../../pipes/zod-validation-pipe";

const editWorkspaceBodySchema = z.object({
  name: z.string(),
  cnpj: z.string(),
  email: z.string().email(),
  cellphone: z.string(),
});

type EditWorkspaceBodySchema = z.infer<typeof editWorkspaceBodySchema>;

@ApiTags("Workspace")
@Controller("/workspace")
export class EditWorkspaceController {
  constructor(private editWorkspace: EditWorkspaceUseCase) {}

  @Put()
  @HttpCode(200)
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: { type: "string", example: "Escritório Modelo" },
        cnpj: { type: "string", example: "00000000000100" },
        email: { type: "string", example: "contato@empresa.com" },
        cellphone: { type: "string", example: "11999999999" },
      },
    },
  })
  @ApiResponse({ status: 200, description: "Workspace updated successfully" })
  @ApiResponse({ status: 404, description: "Workspace not found" })
  async handle(@Body(new ZodValidationPipe(editWorkspaceBodySchema)) body: EditWorkspaceBodySchema) {
    const { name, cnpj, email, cellphone } = body;

    const result = await this.editWorkspace.execute({
      name,
      cnpj,
      email,
      cellphone,
    });

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
