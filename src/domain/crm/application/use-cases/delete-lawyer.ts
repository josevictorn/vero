import { Injectable, Inject } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { LawyersRepository } from "../repositories/lawyers-repository";

interface DeleteLawyerUseCaseRequest {
  id: string;
}

type DeleteLawyerUseCaseResponse = Either<Error, null>;

@Injectable()
export class DeleteLawyerUseCase {
  constructor(
    @Inject(LawyersRepository)
    private lawyersRepository: LawyersRepository
  ) {}

  async execute({ id }: DeleteLawyerUseCaseRequest): Promise<DeleteLawyerUseCaseResponse> {
    const lawyer = await this.lawyersRepository.findById(id);

    if (!lawyer) {
      return left(new Error("Lawyer not found."));
    }

    await this.lawyersRepository.delete(lawyer);

    return right(null);
  }
}
