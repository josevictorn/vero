import { EditAISessionUseCase } from "@/domain/crm/application/use-cases/ai-session/edit-ai-session";
import { AISessionNotFoundError } from "@/domain/crm/application/use-cases/errors/ai-session-not-found-error";
import { StatusEnum } from "@/domain/crm/enterprise/entities/value-objects/status";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Body, Controller, HttpCode, Inject, InternalServerErrorException, NotFoundException, Param, Put } from "@nestjs/common";
import { ApiBody, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { z }from "zod";

const editAISessionParamsSchema = z.object({
    id: z.uuid(),
});

type EditAISessionParamsSchema = z.infer<typeof editAISessionParamsSchema>;

const editAISessionBodySchema = z.object({
    status: z.enum(StatusEnum),
    chatState: z.array(z.object({
        information: z.string(),
    })),
    name: z.string(),
    cellphone: z.string(),
    isThirdParty: z.boolean(),
})

type EditAISessionBodySchema = z.infer<typeof editAISessionBodySchema>;

@ApiTags("AI Session")
@Controller("/ai-sessions/:id")
export class EditAISessionController {
    constructor(
        @Inject(EditAISessionUseCase)
        private editAISession: EditAISessionUseCase
    ) {}

    @Put()
    @HttpCode(200)
    @ApiParam({ name: "id", type: "string", example: "123e4567-e89b-12d3-a456-426614174000" })
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                status: { type: "string", enum: Object.values(StatusEnum), example: "IDENTIFYING" },
                chatState: { type: "array", items: { type: "object", properties: { information: { type: "string" } } }, example: [{ information: "Cliente trabalhou 5 anos na empresa" }] },
                name: { type: "string", example: "Fulano de Tal" },
                cellphone: { type: "string", example: "84994082362" },
                isThirdParty: { type: "boolean", example: false },
            },
            required: ["status", "chatState", "name", "cellphone", "isThirdParty"],
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
    async handle(
        @Param(new ZodValidationPipe(editAISessionParamsSchema)) params: EditAISessionParamsSchema,
        @Body(new ZodValidationPipe(editAISessionBodySchema)) body: EditAISessionBodySchema,
    ){
        const { id } = params;
        const { status, chatState, name, cellphone, isThirdParty } = body;

        const result = await this.editAISession.execute({
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
                    throw new NotFoundException(error.message);
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