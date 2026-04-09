import { DeleteLawyerUseCase } from "@/domain/crm/application/use-cases/lawyer/delete-lawyer";
import { LawyerNotFoundError } from "@/domain/crm/application/use-cases/errors/lawyer-not-found-error";
import { Controller, HttpCode, Delete, Param, NotFoundException, InternalServerErrorException, Inject } from "@nestjs/common";
import { ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { z } from "zod";
import { ZodValidationPipe } from "../../../pipes/zod-validation-pipe";

const deleteLawyerParamsSchema = z.object({
  id: z.uuid(),
});

type DeleteLawyerParamsSchema = z.infer<typeof deleteLawyerParamsSchema>;

@ApiTags("Lawyers")
@Controller("/lawyers/:id")
export class DeleteLawyerController {
  constructor(
    @Inject(DeleteLawyerUseCase)
    private deleteLawyer: DeleteLawyerUseCase
  ) {}

  @Delete()
  @HttpCode(204)
  @ApiParam({ name: "id", type: "string", example: "123e4567-e89b-12d3-a456-426614174000" })
  @ApiResponse({ status: 204, description: "Lawyer deleted successfully" })
  @ApiResponse({ status: 404, description: "Lawyer not found" })
  async handle(@Param(new ZodValidationPipe(deleteLawyerParamsSchema)) params: DeleteLawyerParamsSchema) {
    const { id } = params;

    const result = await this.deleteLawyer.execute({ id });

    if (result.isLeft()) {
      const error = result.value;
      
      switch (error.constructor) {
        case LawyerNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new InternalServerErrorException(error.message);
      }
    }
  }
}
