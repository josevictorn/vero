import { Either, left, right } from "@/core/either";
import { AISession } from "@/domain/crm/enterprise/entities/ai-session";
import { Inject, Injectable } from "@nestjs/common";
import { AISessionRepository } from "../../repositories/ai-session-repository";
import { AISessionNotFoundError } from "../errors/ai-session-not-found-error";

interface GetAISessionUseCaseRequest {
    id: string;
}

type GetAISessionUseCaseResponse = Either<Error, { aiSession: AISession }>;

@Injectable()
export class GetAISessionUseCase {
    constructor(
        @Inject(AISessionRepository)
        private aiSessionRepository: AISessionRepository
    ) {}

    async execute(request: GetAISessionUseCaseRequest): Promise<GetAISessionUseCaseResponse> {
        const aiSession = await this.aiSessionRepository.findById(request.id);

        if (!aiSession) {
            return left(new AISessionNotFoundError());
        }

        return right({ aiSession });
    }
}