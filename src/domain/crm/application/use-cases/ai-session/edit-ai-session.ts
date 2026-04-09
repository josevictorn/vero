import { Either, left, right } from "@/core/either";
import { AISession, ChatState } from "@/domain/crm/enterprise/entities/ai-session";
import { StatusEnum } from "@/domain/crm/enterprise/entities/value-objects/status";
import { AISessionRepository } from "../../repositories/ai-session-repository";
import { AISessionNotFoundError } from "../errors/ai-session-not-found-error";
import { Inject, Injectable } from "@nestjs/common";


interface EditAISessionUseCaseRequest {
    id: string;
    status: StatusEnum;
    chatState: ChatState[];
    name: string;
    cellphone: string;
    isThirdParty: boolean;
}

type EditAISessionUseCaseResponse = Either<Error, { aiSession: AISession }>;

@Injectable()
export class EditAISessionUseCase {
    constructor(
        @Inject(AISessionRepository)
        private aiSessionRepository: AISessionRepository
    ) {}

    async execute(request: EditAISessionUseCaseRequest): Promise<EditAISessionUseCaseResponse> {
        const aiSession = await this.aiSessionRepository.findById(request.id);

        if (!aiSession) {
            return left(new AISessionNotFoundError());
        }

        aiSession.status = request.status;
        aiSession.chatState = request.chatState;
        aiSession.name = request.name;
        aiSession.cellphone = request.cellphone;
        aiSession.isThirdParty = request.isThirdParty;

        await this.aiSessionRepository.update(aiSession);

        return right({ aiSession });
    }
}