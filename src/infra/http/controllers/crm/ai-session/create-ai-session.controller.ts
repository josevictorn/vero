import { CreateAISessionUseCase } from "@/domain/crm/application/use-cases/ai-session/create-ai-session";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Body, Controller, InternalServerErrorException } from "@nestjs/common";
import { z } from "zod";


const createAISessionBodySchema = z.object({
    chatId: z.string(),
    status: z.string(),
    name: z.string(),
    cellphone: z.string(),
})

type CreateAISessionBodySchema = z.infer<typeof createAISessionBodySchema>;

@Controller("/aisession")
export class CreateAISessionController {
    constructor(private createAiSession: CreateAISessionUseCase) {}

    async handle(@Body(new ZodValidationPipe(createAISessionBodySchema)) body: CreateAISessionBodySchema){
        const { chatId, status, name, cellphone } = body;

        const result = await this.createAiSession.execute({
            chatId,
            status,
            name,
            cellphone,
        });

        if (result.isLeft()) {
            throw new InternalServerErrorException("Unexpected error when creating AI session.");
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