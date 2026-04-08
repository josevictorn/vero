import { FetchAISessionsUseCase } from "@/domain/crm/application/use-cases/ai-session/fetch-ai-sessions";
import { Controller, Get, HttpCode, Inject, InternalServerErrorException } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("AI Session")
@Controller("/ai-sessions")
export class FetchAISessionController {
    constructor(
        @Inject(FetchAISessionsUseCase)
        private fetchAISessionsUseCase: FetchAISessionsUseCase
    ) {}

    @Get()
    @HttpCode(200)

    async handle(){
        const result = await this.fetchAISessionsUseCase.execute();

        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                default:
                    throw new InternalServerErrorException(error.message);
            }
        }

        const { aiSessions } = result.value;

        return {
            aiSessions: aiSessions.map((aiSession) => ({
                id: aiSession.id.toString(),
                chatId: aiSession.chatId,
                chatState: aiSession.chatState,
                status: aiSession.status,
                name: aiSession.name,
                cellphone: aiSession.cellphone,
                screeningFlowId: aiSession.screeningFlowId,
                isThirdParty: aiSession.isThirdParty,
                createdAt: aiSession.createdAt,
            })),
        };
    }
}