import { Either, left, right } from "@/core/either";
import { Inject, Injectable } from "@nestjs/common";
import { AISessionRepository } from "../../repositories/ai-session-repository";
import { AISessionNotFoundError } from "../errors/ai-session-not-found-error";


interface DeleteAISessionUseCaseRequest {
    id: string;
}

type DeleteAISessionUseCaseResponse = Either<Error, {}>;

@Injectable()
export class DeleteAISessionUseCase {
    constructor(
        @Inject(AISessionRepository)
        private aiSessionRepository: AISessionRepository
    ) {}

    async execute(request: DeleteAISessionUseCaseRequest): Promise<DeleteAISessionUseCaseResponse> {
        const aiSession = await this.aiSessionRepository.findById(request.id);

        if (!aiSession) {
            return left(new AISessionNotFoundError());
        }

        await this.aiSessionRepository.delete(aiSession);

        return right({});
    }
}