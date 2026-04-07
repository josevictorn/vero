import { Injectable, Inject } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { Lawyer } from "../../enterprise/entities/lawyer";
import { LawyersRepository } from "../repositories/lawyers-repository";
import { LawyerNotFoundError } from "./errors/lawyer-not-found-error";

interface GetLawyerUseCaseRequest {
  id: string;
}

type GetLawyerUseCaseResponse = Either<Error, { lawyer: Lawyer }>;

@Injectable()
export class GetLawyerUseCase {
  constructor(
    @Inject(LawyersRepository)
    private lawyersRepository: LawyersRepository
  ) {}

  async execute({ id }: GetLawyerUseCaseRequest): Promise<GetLawyerUseCaseResponse> {
    const lawyer = await this.lawyersRepository.findById(id);

    if (!lawyer) {
      return left(new LawyerNotFoundError());
    }

    return right({ lawyer });
  }
}
