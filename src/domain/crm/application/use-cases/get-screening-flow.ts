import { Either, left, right } from "@/core/either";
import { ScreeningFlow } from "../../enterprise/entities/screening-flow";
import { ScreeningFlowRepository } from "../repositories/screening-flow-repository";

interface GetScreeningFlowUseCaseRequest {
  id: string;
}

type GetScreeningFlowUseCaseResponse = Either<Error, { screeningFlow: ScreeningFlow }>;

export class GetScreeningFlowUseCase {
  constructor(private screeningFlowRepository: ScreeningFlowRepository) {}

  async execute(
    request: GetScreeningFlowUseCaseRequest
  ): Promise<GetScreeningFlowUseCaseResponse> {
    const screeningFlow = await this.screeningFlowRepository.findById(request.id);

    if (!screeningFlow) {
      return left(new Error("Screening flow not found."));
    }

    return right({ screeningFlow });
  }
}
