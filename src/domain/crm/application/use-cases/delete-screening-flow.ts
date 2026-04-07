import { Injectable, Inject } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { ScreeningFlowsRepository } from "../repositories/screening-flows-repository";
import { ScreeningFlowNotFoundError } from "./errors/screening-flow-not-found-error";

interface DeleteScreeningFlowUseCaseRequest {
  id: string;
}

type DeleteScreeningFlowUseCaseResponse = Either<Error, null>;

@Injectable()
export class DeleteScreeningFlowUseCase {
  constructor(
    @Inject(ScreeningFlowsRepository)
    private screeningFlowsRepository: ScreeningFlowsRepository
  ) {}

  async execute(
    request: DeleteScreeningFlowUseCaseRequest
  ): Promise<DeleteScreeningFlowUseCaseResponse> {
    const screeningFlow = await this.screeningFlowsRepository.findById(request.id);

    if (!screeningFlow) {
      return left(new ScreeningFlowNotFoundError());
    }

    await this.screeningFlowsRepository.delete(screeningFlow);

    return right(null);
  }
}
