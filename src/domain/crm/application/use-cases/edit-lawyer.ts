import { Injectable, Inject } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { Lawyer } from "../../enterprise/entities/lawyer";
import { LawyersRepository } from "../repositories/lawyers-repository";
import { LawyerNotFoundError } from "./errors/lawyer-not-found-error";

interface EditLawyerUseCaseRequest {
  id: string;
  cellphone: string;
}

type EditLawyerUseCaseResponse = Either<Error, { lawyer: Lawyer }>;

@Injectable()
export class EditLawyerUseCase {
  constructor(
    @Inject(LawyersRepository)
    private lawyersRepository: LawyersRepository
  ) {}

  async execute({
    id,
    cellphone,
  }: EditLawyerUseCaseRequest): Promise<EditLawyerUseCaseResponse> {
    const lawyer = await this.lawyersRepository.findById(id);

    if (!lawyer) {
      return left(new LawyerNotFoundError());
    }

    lawyer.cellphone = cellphone;

    await this.lawyersRepository.update(lawyer);

    return right({ lawyer });
  }
}
