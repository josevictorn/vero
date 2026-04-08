import { GetAISessionUseCase } from "@/domain/crm/application/use-cases/ai-session/get-ai-session";
import { AISessionNotFoundError } from "@/domain/crm/application/use-cases/errors/ai-session-not-found-error";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { ConflictException, Controller, Get, HttpCode, Inject, InternalServerErrorException, Param } from "@nestjs/common";
import { ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { z } from "zod";


const getAISessionParamsSchema = z.object({
    id: z.uuid(),
})

type GetAISessionParamsSchema = z.infer<typeof getAISessionParamsSchema>;

@ApiTags("AI Session")
@Controller("/ai-sessions/:id")
export class GetAISessionController {
    constructor(
        @Inject(GetAISessionUseCase)
        private getAISession: GetAISessionUseCase
    ) {}

    @Get()
    @HttpCode(200)
    @ApiParam({
        name: "id",
        type: "uuid",
        example: "{id}",
    })
    @ApiResponse({
        status: 200,
        description: "AI session found successfully",
    })
    @ApiResponse({
        status: 404,
        description: "AI session not found",
    })
    async handle(@Param(new ZodValidationPipe(getAISessionParamsSchema)) params: GetAISessionParamsSchema){
        const { id } = params;

        const result = await this.getAISession.execute({
            id,
        });

        if (result.isLeft()) {
            const error = result.value;
        
            switch (error.constructor) {
                case AISessionNotFoundError:
                    throw new ConflictException(error.message);
                default:
                    throw new InternalServerErrorException(error.message);
            }
        }

        const { aiSession } = result.value;

        return {
            aiSession: {
                id: aiSession.id.toString(),
                chatId: aiSession.chatId,
                chatState: aiSession.chatState,
                status: aiSession.status,
                name: aiSession.name,
                cellphone: aiSession.cellphone,
                screeningFlowId: aiSession.screeningFlowId,
                isThirdParty: aiSession.isThirdParty,
                createdAt: aiSession.createdAt,
            },
        };
    }
}