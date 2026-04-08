import { LawyerNotFoundError } from "@/domain/crm/application/use-cases/errors/lawyer-not-found-error";
import { GetLawyerUseCase } from "@/domain/crm/application/use-cases/lawyer/get-lawyer";
import { Controller, Get, Param, NotFoundException, InternalServerErrorException, Inject } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Lawyers")
@Controller("/lawyers/:id")
export class GetLawyerController {
  constructor(
    @Inject(GetLawyerUseCase)
    private getLawyer: GetLawyerUseCase
  ) {}

  @Get()
  @ApiResponse({ status: 200, description: "Lawyer fetched successfully" })
  @ApiResponse({ status: 404, description: "Lawyer not found" })
  async handle(@Param("id") id: string) {
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
