import { Injectable, Inject } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { Workspace } from "../../enterprise/entities/workspace";
import { WorkspacesRepository } from "../repositories/workspaces-repository";

type GetWorkspaceUseCaseResponse = Either<Error, { workspace: Workspace }>;

@Injectable()
export class GetWorkspaceUseCase {
  constructor(
    @Inject(WorkspacesRepository)
    private workspacesRepository: WorkspacesRepository
  ) {}

  async execute(): Promise<GetWorkspaceUseCaseResponse> {
    const workspace = await this.workspacesRepository.findFirst();

    if (!workspace) {
      return left(new Error("Workspace not found/seeded."));
    }

    return right({ workspace });
  }
}
