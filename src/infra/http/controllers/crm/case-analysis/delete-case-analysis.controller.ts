import { DeleteCaseAnalysisUseCase } from "@/domain/crm/application/use-cases/case-analysis/delete-case-analysis"
import { CaseAnalysisNotFoundError } from "@/domain/crm/application/use-cases/errors/case-analysis-not-found-error"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"
import { Controller, Delete, HttpCode, Inject, InternalServerErrorException, NotFoundException, Param } from "@nestjs/common"
import { ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger"
import { z } from "zod"


const deleteCaseAnalysisParamSchema = z.object({
    id: z.uuid(),
})

type DeleteCaseAnalysisParamSchema = z.infer<typeof deleteCaseAnalysisParamSchema>

@ApiTags("Case Analysis")
@Controller("/case-analyses/:id")
export class DeleteCaseAnalysisController {

    constructor(
        @Inject(DeleteCaseAnalysisUseCase)
        private delteCaseAnalysisUseCase: DeleteCaseAnalysisUseCase
    ) {}

    @Delete()
    @HttpCode(204)
    @ApiParam({
        name: "id",
        type: "string",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @ApiResponse({
        status: 204,
        description: "Case analysis deleted successfully",
    })
    @ApiResponse({
        status: 404,
        description: "Case analysis not found",
    })
    async handle(@Param(new ZodValidationPipe(deleteCaseAnalysisParamSchema)) param: DeleteCaseAnalysisParamSchema) {
        const { id } = param;

        const result = await this.delteCaseAnalysisUseCase.execute({
            id,
        });

        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case CaseAnalysisNotFoundError:
                    throw new NotFoundException(error.message);
                default:
                    throw new InternalServerErrorException(error.message);
            }
        }
    }
}