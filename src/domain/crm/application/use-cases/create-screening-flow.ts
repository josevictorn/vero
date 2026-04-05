import { Injectable, Inject } from "@nestjs/common";
import { Either, right } from "@/core/either";
import { ScreeningFlow } from "../../enterprise/entities/screening-flow";
import { ScreeningFlowRepository } from "../repositories/screening-flow-repository";

interface CreateScreeningFlowUseCaseRequest {
    caseType: string;
    questions: any;
}

type CreateScreeningFlowUseCaseResponse = Either<null, { screeningFlow: ScreeningFlow }>;

@Injectable()
export class CreateScreeningFlowUseCase {
    constructor(
      @Inject(ScreeningFlowRepository)
      private screeningFlowRepository: ScreeningFlowRepository
    ) {}

    async execute(request: CreateScreeningFlowUseCaseRequest): Promise<CreateScreeningFlowUseCaseResponse> {
        const { caseType, questions } = request;

        const screeningFlow = ScreeningFlow.create({
            caseType,
            questions,
        });

        await this.screeningFlowRepository.create(screeningFlow);

        return right({ screeningFlow });
    }
}