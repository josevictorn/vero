import { GetLawyerUseCase } from "@/domain/crm/application/use-cases/get-lawyer";
import { Controller, Get, Param, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Lawyers")
@Controller("/lawyers/:id")
export class GetLawyerController {
  constructor(private getLawyer: GetLawyerUseCase) {}

  @Get()
  @ApiResponse({ status: 200, description: "Lawyer fetched successfully" })
  @ApiResponse({ status: 404, description: "Lawyer not found" })
  async handle(@Param("id") id: string) {
    const result = await this.getLawyer.execute({ id });

    if (result.isLeft()) {
      const error = result.value;
      if (error.message.includes("not found")) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(error.message);
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
