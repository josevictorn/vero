import { Either, right } from "@/core/either";
import { AISession } from "@/domain/crm/enterprise/entities/ai-session";
import { Inject, Injectable } from "@nestjs/common";
import { AISessionRepository } from "../../repositories/ai-session-repository";


type FetchAISessionsUseCaseResponse = Either<Error, { aiSessions: AISession[] }>

@Injectable()
export class FetchAISessionsUseCase {
    constructor(
        @Inject(AISessionRepository)
        private aiSessionRepository: AISessionRepository
    ) {}

    async execute(): Promise<FetchAISessionsUseCaseResponse> {
        const aiSessions = await this.aiSessionRepository.findAll();

        return right({ aiSessions });
    }
}