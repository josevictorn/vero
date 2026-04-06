import { EditLawyerUseCase } from "@/domain/crm/application/use-cases/edit-lawyer";
import { Body, Controller, HttpCode, Param, Put, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { z } from "zod";

const editLawyerBodySchema = z.object({
  cellphone: z.string(),
});

type EditLawyerBodySchema = z.infer<typeof editLawyerBodySchema>;

@ApiTags("Lawyers")
@Controller("/lawyers/:id")
export class EditLawyerController {
  constructor(private editLawyer: EditLawyerUseCase) {}

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
  async handle(@Param("id") id: string, @Body() body: EditLawyerBodySchema) {
    const { cellphone } = body;

    const result = await this.editLawyer.execute({
      id,
      cellphone,
    });

    if (result.isLeft()) {
      const error = result.value;
      if (error.message.includes("not found")) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
