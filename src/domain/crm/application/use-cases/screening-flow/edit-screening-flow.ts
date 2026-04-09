import { Injectable, Inject } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { ScreeningFlow, type Question } from "../../../enterprise/entities/screening-flow";
import { ScreeningFlowsRepository } from "../../repositories/screening-flows-repository";
import { ScreeningFlowNotFoundError } from "../errors/screening-flow-not-found-error";

interface EditScreeningFlowUseCaseRequest {
  id: string;
  caseType: string;
  questions: Question[];
}

type EditScreeningFlowUseCaseResponse = Either<Error, { screeningFlow: ScreeningFlow }>;

@Injectable()
export class EditScreeningFlowUseCase {
  constructor(
    @Inject(ScreeningFlowsRepository)
    private screeningFlowsRepository: ScreeningFlowsRepository
  ) {}

  async execute(
    request: EditScreeningFlowUseCaseRequest
  ): Promise<EditScreeningFlowUseCaseResponse> {
    const screeningFlow = await this.screeningFlowsRepository.findById(request.id);

    if (!screeningFlow) {
      return left(new ScreeningFlowNotFoundError());
    }

    screeningFlow.caseType = request.caseType;
    screeningFlow.questions = request.questions;

    await this.screeningFlowsRepository.update(screeningFlow);

    return right({ screeningFlow });
  }
}
