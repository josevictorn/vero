import { Injectable, Inject } from "@nestjs/common";
import { Either, right } from "@/core/either";
import { ScreeningFlow, type Question } from "../../enterprise/entities/screening-flow";
import { ScreeningFlowsRepository } from "../repositories/screening-flows-repository";

interface CreateScreeningFlowUseCaseRequest {
    caseType: string;
    questions: Question[];
}

type CreateScreeningFlowUseCaseResponse = Either<null, { screeningFlow: ScreeningFlow }>;

@Injectable()
export class CreateScreeningFlowUseCase {
    constructor(
      @Inject(ScreeningFlowsRepository)
      private screeningFlowsRepository: ScreeningFlowsRepository
    ) {}

    async execute(request: CreateScreeningFlowUseCaseRequest): Promise<CreateScreeningFlowUseCaseResponse> {
        const { caseType, questions } = request;

        const screeningFlow = ScreeningFlow.create({
            caseType,
            questions,
        });

        await this.screeningFlowsRepository.create(screeningFlow);

        return right({ screeningFlow });
    }
}