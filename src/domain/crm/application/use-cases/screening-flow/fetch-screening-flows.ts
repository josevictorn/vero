import { Injectable, Inject } from "@nestjs/common";
import { Either, right } from "@/core/either";
import { ScreeningFlow } from "../../../enterprise/entities/screening-flow";
import { ScreeningFlowsRepository } from "../../repositories/screening-flows-repository";

type FetchScreeningFlowsUseCaseResponse = Either<null, { screeningFlows: ScreeningFlow[] }>;

@Injectable()
export class FetchScreeningFlowsUseCase {
  constructor(
    @Inject(ScreeningFlowsRepository)
    private screeningFlowsRepository: ScreeningFlowsRepository
  ) {}

  async execute(): Promise<FetchScreeningFlowsUseCaseResponse> {
    const screeningFlows = await this.screeningFlowsRepository.findAll();

    return right({ screeningFlows });
  }
}
