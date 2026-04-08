import { DeleteCaseAnalysisUseCase } from "@/domain/crm/application/use-cases/case-analysis/delete-case-analysis"
import { CaseAnalysisNotFoundError } from "@/domain/crm/application/use-cases/errors/case-analysis-not-found-error"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"
import { Controller, Inject, InternalServerErrorException, NotFoundException, Param } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
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