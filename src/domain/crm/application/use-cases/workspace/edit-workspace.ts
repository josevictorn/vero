import { Injectable, Inject } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { Workspace } from "../../../enterprise/entities/workspace";
import { WorkspacesRepository } from "../../repositories/workspaces-repository";
import { WorkspaceDoesntExistError } from "../errors/workspace-doesnt-exist-error";

interface EditWorkspaceUseCaseRequest {
  name: string;
  cnpj: string;
  email: string;
  cellphone: string;
}

type EditWorkspaceUseCaseResponse = Either<Error, { workspace: Workspace }>;

@Injectable()
export class EditWorkspaceUseCase {
  constructor(
    @Inject(WorkspacesRepository)
    private workspacesRepository: WorkspacesRepository
  ) {}

  async execute({
    name,
    cnpj,
    email,
    cellphone,
  }: EditWorkspaceUseCaseRequest): Promise<EditWorkspaceUseCaseResponse> {
    const workspace = await this.workspacesRepository.findFirst();

    if (!workspace) {
      return left(new WorkspaceDoesntExistError());
    }

    workspace.name = name;
    workspace.cnpj = cnpj;
    workspace.email = email;
    workspace.cellphone = cellphone;

    await this.workspacesRepository.update(workspace);

    return right({ workspace });
  }
}
