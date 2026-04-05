import { Either, left, right } from "@/core/either";
import { ScreeningFlowRepository } from "../repositories/screening-flow-repository";

interface DeleteScreeningFlowUseCaseRequest {
  id: string;
}

type DeleteScreeningFlowUseCaseResponse = Either<Error, null>;

export class DeleteScreeningFlowUseCase {
  constructor(private screeningFlowRepository: ScreeningFlowRepository) {}

  async execute(
    request: DeleteScreeningFlowUseCaseRequest
  ): Promise<DeleteScreeningFlowUseCaseResponse> {
    const screeningFlow = await this.screeningFlowRepository.findById(request.id);

    if (!screeningFlow) {
      return left(new Error("Screening flow not found."));
    }

    await this.screeningFlowRepository.delete(screeningFlow);

    return right(null);
  }
}
