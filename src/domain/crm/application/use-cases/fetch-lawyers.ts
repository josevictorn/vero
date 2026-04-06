import { Injectable, Inject } from "@nestjs/common";
import { Either, right } from "@/core/either";
import { Lawyer } from "../../enterprise/entities/lawyer";
import { LawyersRepository } from "../repositories/lawyers-repository";

type FetchLawyersUseCaseResponse = Either<null, { lawyers: Lawyer[] }>;

@Injectable()
export class FetchLawyersUseCase {
  constructor(
    @Inject(LawyersRepository)
    private lawyersRepository: LawyersRepository
  ) {}

  async execute(): Promise<FetchLawyersUseCaseResponse> {
    const lawyers = await this.lawyersRepository.findAll();
    return right({ lawyers });
  }
}
