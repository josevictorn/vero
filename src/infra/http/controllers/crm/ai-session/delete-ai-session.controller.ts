import { DeleteAISessionUseCase } from "@/domain/crm/application/use-cases/ai-session/delete-ai-session";
import { AISessionNotFoundError } from "@/domain/crm/application/use-cases/errors/ai-session-not-found-error";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Controller, Delete, HttpCode, Inject, InternalServerErrorException, NotFoundException, Param } from "@nestjs/common";
import { ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { z } from "zod";

const deleteAISessionParamsSchema = z.object({
    id: z.uuid(),
})

type DeleteAISessionParamsSchema = z.infer<typeof deleteAISessionParamsSchema>;

@ApiTags("AI Session")
@Controller("/ai-sessions/:id")
export class DeleteAISessionController {
    constructor(
        @Inject(DeleteAISessionUseCase)
        private deleteAISession: DeleteAISessionUseCase
    ) {}

    @Delete()
    @HttpCode(204)
    @ApiParam({
        name: "id",
        type: "uuid",
        example: "{id}",
    })
    @ApiResponse({
        status: 204,
        description: "AI session deleted successfully",
    })
    @ApiResponse({
        status: 404,
        description: "AI session not found",
    })
    async handle(@Param(new ZodValidationPipe(deleteAISessionParamsSchema)) params: DeleteAISessionParamsSchema){
        const { id } = params;

        const result = await this.deleteAISession.execute({
            id,
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
    }
}