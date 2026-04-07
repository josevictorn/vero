import { Injectable, Inject } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { ScreeningFlow } from "../../../enterprise/entities/screening-flow";
import { ScreeningFlowsRepository } from "../../repositories/screening-flows-repository";
import { ScreeningFlowNotFoundError } from "../errors/screening-flow-not-found-error";

interface GetScreeningFlowUseCaseRequest {
  id: string;
}

type GetScreeningFlowUseCaseResponse = Either<Error, { screeningFlow: ScreeningFlow }>;

@Injectable()
export class GetScreeningFlowUseCase {
  constructor(
    @Inject(ScreeningFlowsRepository)
    private screeningFlowsRepository: ScreeningFlowsRepository
  ) {}

  async execute(
    request: GetScreeningFlowUseCaseRequest
  ): Promise<GetScreeningFlowUseCaseResponse> {
    const screeningFlow = await this.screeningFlowsRepository.findById(request.id);

    if (!screeningFlow) {
      return left(new ScreeningFlowNotFoundError());
    }

    return right({ screeningFlow });
  }
}
