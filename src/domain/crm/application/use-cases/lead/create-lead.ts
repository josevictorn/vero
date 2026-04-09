import { Injectable, Inject } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { Lead } from "../../../enterprise/entities/lead";
import { LeadsRepository } from "../../repositories/leads-repository";
import { WorkspacesRepository } from "../../repositories/workspaces-repository";
import { LawyersRepository } from "../../repositories/lawyers-repository";
import { LawyerNotFoundError } from "../errors/lawyer-not-found-error";
import { WorkspaceDoesntExistError } from "../errors/workspace-doesnt-exist-error";

interface CreateLeadUseCaseRequest {
  lawyerId?: string | null;
  name: string;
  cellphone: string;
  email: string;
}

type CreateLeadUseCaseResponse = Either<Error, { lead: Lead }>;

@Injectable()
export class CreateLeadUseCase {
  constructor(
    @Inject(LeadsRepository)
    private leadsRepository: LeadsRepository,
    @Inject(WorkspacesRepository)
    private workspacesRepository: WorkspacesRepository,
    @Inject(LawyersRepository)
    private lawyersRepository: LawyersRepository
  ) {}

  async execute({
    lawyerId,
    name,
    cellphone,
    email,
  }: CreateLeadUseCaseRequest): Promise<CreateLeadUseCaseResponse> {
    const defaultWorkspace = await this.workspacesRepository.findFirst();

    if (!defaultWorkspace) {
      return left(new WorkspaceDoesntExistError());
    }

    if (lawyerId) {
      const lawyer = await this.lawyersRepository.findById(lawyerId);

      if (!lawyer) {
        return left(new LawyerNotFoundError());
      }
    }

    const lead = Lead.create({
      workspaceId: defaultWorkspace.id.toString(),
      lawyerId,
      name,
      cellphone,
      email,
    });

    await this.leadsRepository.create(lead);

    return right({ lead });
  }
}
