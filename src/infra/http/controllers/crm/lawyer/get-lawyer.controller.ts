import { LawyerNotFoundError } from "@/domain/crm/application/use-cases/errors/lawyer-not-found-error";
import { GetLawyerUseCase } from "@/domain/crm/application/use-cases/lawyer/get-lawyer";
import { Controller, Get, Param, NotFoundException, InternalServerErrorException, Inject } from "@nestjs/common";
import { ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { z } from "zod";
import { ZodValidationPipe } from "../../../pipes/zod-validation-pipe";

const getLawyerParamsSchema = z.object({
  id: z.uuid(),
});

type GetLawyerParamsSchema = z.infer<typeof getLawyerParamsSchema>;

@ApiTags("Lawyers")
@Controller("/lawyers/:id")
export class GetLawyerController {
  constructor(
    @Inject(GetLawyerUseCase)
    private getLawyer: GetLawyerUseCase
  ) {}

  @Get()
  @ApiParam({ name: "id", type: "string", example: "123e4567-e89b-12d3-a456-426614174000" })
  @ApiResponse({ status: 200, description: "Lawyer fetched successfully" })
  @ApiResponse({ status: 404, description: "Lawyer not found" })
  async handle(@Param(new ZodValidationPipe(getLawyerParamsSchema)) params: GetLawyerParamsSchema) {
    const { id } = params;

    const result = await this.getLawyer.execute({ id });

    if (result.isLeft()) {
      const error = result.value;
      
      switch (error.constructor) {
        case LawyerNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new InternalServerErrorException(error.message);
      }
    }

    const { lawyer } = result.value;

    return {
      lawyer: {
        id: lawyer.id.toString(),
        userId: lawyer.userId,
        workspaceId: lawyer.workspaceId,
        cellphone: lawyer.cellphone,
        createdAt: lawyer.createdAt,
      },
    };
  }
}
