import { DeleteLawyerUseCase } from "@/domain/crm/application/use-cases/delete-lawyer";
import { Controller, HttpCode, Delete, Param, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Lawyers")
@Controller("/lawyers/:id")
export class DeleteLawyerController {
  constructor(private deleteLawyer: DeleteLawyerUseCase) {}

  @Delete()
  @HttpCode(204)
  @ApiResponse({ status: 204, description: "Lawyer deleted successfully" })
  @ApiResponse({ status: 404, description: "Lawyer not found" })
  async handle(@Param("id") id: string) {
    const result = await this.deleteLawyer.execute({ id });

    if (result.isLeft()) {
      const error = result.value;
      if (error.message.includes("not found")) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
