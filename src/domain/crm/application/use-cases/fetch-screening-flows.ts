import { Injectable, Inject } from "@nestjs/common";
import { Either, right } from "@/core/either";
import { ScreeningFlow } from "../../enterprise/entities/screening-flow";
import { ScreeningFlowRepository } from "../repositories/screening-flow-repository";

type FetchScreeningFlowsUseCaseResponse = Either<null, { screeningFlows: ScreeningFlow[] }>;

@Injectable()
export class FetchScreeningFlowsUseCase {
  constructor(
    @Inject(ScreeningFlowRepository)
    private screeningFlowRepository: ScreeningFlowRepository
  ) {}

  async execute(): Promise<FetchScreeningFlowsUseCaseResponse> {
    const screeningFlows = await this.screeningFlowRepository.findAll();

    return right({ screeningFlows });
  }
}
