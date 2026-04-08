import { EditLawyerUseCase } from "@/domain/crm/application/use-cases/lawyer/edit-lawyer";
import { LawyerNotFoundError } from "@/domain/crm/application/use-cases/errors/lawyer-not-found-error";
import { Body, Controller, HttpCode, Inject, Param, Put, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { z } from "zod";
import { ZodValidationPipe } from "../../../pipes/zod-validation-pipe";

const editLawyerBodySchema = z.object({
  cellphone: z.string(),
});

type EditLawyerBodySchema = z.infer<typeof editLawyerBodySchema>;

@ApiTags("Lawyers")
@Controller("/lawyers/:id")
export class EditLawyerController {
  constructor(
    @Inject(EditLawyerUseCase)
    private editLawyer: EditLawyerUseCase
  ) {}

  @Put()
  @HttpCode(200)
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        cellphone: { type: "string" },
      },
    },
  })
  @ApiResponse({ status: 200, description: "Lawyer updated successfully" })
  @ApiResponse({ status: 404, description: "Lawyer not found" })
  async handle(@Param("id") id: string, @Body(new ZodValidationPipe(editLawyerBodySchema)) body: EditLawyerBodySchema) {
    const { cellphone } = body;

    const result = await this.editLawyer.execute({
      id,
      cellphone,
    });

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
