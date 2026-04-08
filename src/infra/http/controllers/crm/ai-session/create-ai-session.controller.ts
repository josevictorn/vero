import { CreateAISessionUseCase } from "@/domain/crm/application/use-cases/ai-session/create-ai-session";
import { AISessionAlreadyExistsError } from "@/domain/crm/application/use-cases/errors/ai-session-already-exists-error";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Body, ConflictException, Controller, HttpCode, Inject, InternalServerErrorException, Post } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { z } from "zod";


const createAISessionBodySchema = z.object({
    chatId: z.string(),
    name: z.string(),
    cellphone: z.string(),
})

type CreateAISessionBodySchema = z.infer<typeof createAISessionBodySchema>;

@ApiTags("AI Session")
@Controller("/ai-sessions")
export class CreateAISessionController {
    constructor(
        @Inject(CreateAISessionUseCase)
        private createAiSession: CreateAISessionUseCase
    ) {}

    @Post()
    @HttpCode(201)
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                chatId: { type: "string", example: "84994082362@whatsapp" },
                name: { type: "string", example: "fulano" },
                cellphone: { type: "string", example: "84994082362" },
            },
            required: ["chatId", "name", "cellphone"],
        },
    })
    @ApiResponse({
        status: 201,
        description: "AI session created successfully",
    })
    @ApiResponse({
        status: 400,
        description: "Validation failed or other bad request error",
    })
    async handle(@Body(new ZodValidationPipe(createAISessionBodySchema)) body: CreateAISessionBodySchema){
        const { chatId, name, cellphone } = body;

        const result = await this.createAiSession.execute({
            chatId,
            name,
            cellphone,
        });

        if (result.isLeft()) {
            const error = result.value;
        
            switch (error.constructor) {
                case AISessionAlreadyExistsError:
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