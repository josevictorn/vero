import { EditAiSessionUseCase } from "@/domain/crm/application/use-cases/ai-session/edit-ai-session";
import { AISessionNotFoundError } from "@/domain/crm/application/use-cases/errors/ai-session-not-found-error";
import { StatusEnum } from "@/domain/crm/enterprise/entities/value-objects/status";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Body, ConflictException, Controller, HttpCode, Inject, InternalServerErrorException, Put } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { z }from "zod";

const editAiSessionBodySchema = z.object({
    id: z.uuid(),
    status: z.enum(StatusEnum),
    chatState: z.array(z.object({
        information: z.string(),
    })),
    name: z.string(),
    cellphone: z.string(),
    isThirdParty: z.boolean(),
})

type EditAISessionBodySchema = z.infer<typeof editAiSessionBodySchema>;

@ApiTags("AI Session")
@Controller("/ai-sessions/:id")
export class EditAISessionController {
    constructor(
        @Inject(EditAiSessionUseCase)
        private editAiSession: EditAiSessionUseCase
    ) {}

    @Put()
    @HttpCode(200)
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                id: { type: "uuid", example: "{id}" },
                status: { type: "string", enum: Object.values(StatusEnum) },
                chatState: { type: "array", items: { type: "object", properties: { information: { type: "string" } } } },
                name: { type: "string", example: "fulano" },
                cellphone: { type: "string", example: "84994082362" },
                isThirdParty: { type: "boolean", example: false },
            },
            required: ["id", "status", "chatState", "name", "cellphone", "isThirdParty"],
        },
    })
    @ApiResponse({
        status: 200,
        description: "AI session updated successfully",
    })
    @ApiResponse({
        status: 404,
        description: "AI session not found",
    })
    async handle(@Body(new ZodValidationPipe(editAiSessionBodySchema)) body: EditAISessionBodySchema){
        const { id, status, chatState, name, cellphone, isThirdParty } = body;

        const result = await this.editAiSession.execute({
            id,
            status,
            chatState,
            name,
            cellphone,
            isThirdParty,
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