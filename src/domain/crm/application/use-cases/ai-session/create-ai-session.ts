import { Inject, Injectable } from "@nestjs/common";
import { AISessionRepository } from "../../repositories/ai-session-repository";
import { AISession, type ChatState } from "@/domain/crm/enterprise/entities/ai-session";
import { Either, right } from "@/core/either";

interface CreateAISessionUseCaseRequest {
    chatId: string;
    chatState: ChatState[];
    status: string;
    name: string;
    cellphone: string;
}

type CreateAISessionUseCaseResponse = Either<null, { aiSession: AISession }>;

@Injectable()
export class CreateAISessionUseCase {
    constructor(
        @Inject(AISessionRepository)
        private aiSessionRepository: AISessionRepository
    ) {}

    async execute(request: CreateAISessionUseCaseRequest): Promise<CreateAISessionUseCaseResponse> {
        const { chatId, chatState, status, name, cellphone } = request;

        const aiSession = AISession.create({
            chatId,
            chatState,
            status,
            name,
            cellphone,
            screeningFlowId: "",
            isThirdParty: false
        });

        await this.aiSessionRepository.create(aiSession);

        return right({ aiSession });
    }
}