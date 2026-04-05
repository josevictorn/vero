import { Either, left, right } from "@/core/either";
import { ScreeningFlow } from "../../enterprise/entities/screening-flow";
import { ScreeningFlowRepository } from "../repositories/screening-flow-repository";

interface EditScreeningFlowUseCaseRequest {
  id: string;
  caseType: string;
  questions: any;
}

type EditScreeningFlowUseCaseResponse = Either<Error, { screeningFlow: ScreeningFlow }>;

export class EditScreeningFlowUseCase {
  constructor(private screeningFlowRepository: ScreeningFlowRepository) {}

  async execute(
    request: EditScreeningFlowUseCaseRequest
  ): Promise<EditScreeningFlowUseCaseResponse> {
    const screeningFlow = await this.screeningFlowRepository.findById(request.id);

    if (!screeningFlow) {
      return left(new Error("Screening flow not found."));
    }

    screeningFlow.caseType = request.caseType;
    screeningFlow.questions = request.questions;

    await this.screeningFlowRepository.update(screeningFlow);

    return right({ screeningFlow });
  }
}
