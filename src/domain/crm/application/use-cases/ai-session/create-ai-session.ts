import { Inject, Injectable } from "@nestjs/common";
import { AISessionRepository } from "../../repositories/ai-session-repository";
import { AISession, type ChatState } from "@/domain/crm/enterprise/entities/ai-session";
import { Either, left, right } from "@/core/either";
import { AISessionAlreadyExistsError } from "../errors/ai-session-already-exists-error";

interface CreateAISessionUseCaseRequest {
    chatId: string;
    name: string;
    cellphone: string;
}

type CreateAISessionUseCaseResponse = Either<Error, { aiSession: AISession }>;

@Injectable()
export class CreateAISessionUseCase {
    constructor(
        @Inject(AISessionRepository)
        private aiSessionRepository: AISessionRepository
    ) {}

    async execute(request: CreateAISessionUseCaseRequest): Promise<CreateAISessionUseCaseResponse> {
        const { chatId, name, cellphone } = request;

        const aiSessionAlreadyExists = await this.aiSessionRepository.findActiveSessionByChatId(chatId);

        if (aiSessionAlreadyExists) {
            return left(new AISessionAlreadyExistsError());
        }

        const aiSession = AISession.create({
            chatId,
            name,
            cellphone,
        });

        await this.aiSessionRepository.create(aiSession);

        return right({ aiSession });
    }
}