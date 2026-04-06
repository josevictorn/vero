import { Injectable, Inject } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { Lawyer } from "../../enterprise/entities/lawyer";
import { LawyersRepository } from "../repositories/lawyers-repository";
import { WorkspacesRepository } from "../repositories/workspaces-repository";

interface CreateLawyerUseCaseRequest {
  userId: string;
  cellphone: string;
}

type CreateLawyerUseCaseResponse = Either<Error, { lawyer: Lawyer }>;

@Injectable()
export class CreateLawyerUseCase {
  constructor(
    @Inject(LawyersRepository)
    private lawyersRepository: LawyersRepository,
    @Inject(WorkspacesRepository)
    private workspacesRepository: WorkspacesRepository
  ) {}

  async execute({
    userId,
    cellphone,
  }: CreateLawyerUseCaseRequest): Promise<CreateLawyerUseCaseResponse> {
    const defaultWorkspace = await this.workspacesRepository.findFirst();

    if (!defaultWorkspace) {
      return left(new Error("Default Workspace is not seeded."));
    }

    const lawyerAlreadyExists = await this.lawyersRepository.findByUserId(userId);
    if (lawyerAlreadyExists) {
      return left(new Error("This User is already registered as a Lawyer."));
    }

    const lawyer = Lawyer.create({
      userId,
      workspaceId: defaultWorkspace.id.toString(),
      cellphone,
    });

    await this.lawyersRepository.create(lawyer);

    return right({ lawyer });
  }
}
