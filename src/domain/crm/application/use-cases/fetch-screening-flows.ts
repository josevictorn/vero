import { Either, right } from "@/core/either";
import { ScreeningFlow } from "../../enterprise/entities/screening-flow";
import { ScreeningFlowRepository } from "../repositories/screening-flow-repository";

type FetchScreeningFlowsUseCaseResponse = Either<null, { screeningFlows: ScreeningFlow[] }>;

export class FetchScreeningFlowsUseCase {
  constructor(private screeningFlowRepository: ScreeningFlowRepository) {}

  async execute(): Promise<FetchScreeningFlowsUseCaseResponse> {
    const screeningFlows = await this.screeningFlowRepository.findAll();

    return right({ screeningFlows });
  }
}
