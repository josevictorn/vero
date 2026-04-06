import { FetchLawyersUseCase } from "@/domain/crm/application/use-cases/fetch-lawyers";
import { Controller, Get, InternalServerErrorException } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Lawyers")
@Controller("/lawyers")
export class FetchLawyersController {
  constructor(private fetchLawyers: FetchLawyersUseCase) {}

  @Get()
  @ApiResponse({ status: 200, description: "List of lawyers in the workspace" })
  async handle() {
    const result = await this.fetchLawyers.execute();

    if (result.isLeft()) {
      throw new InternalServerErrorException("Unknown error occurred");
    }

    const { lawyers } = result.value;

    return {
      lawyers: lawyers.map((lawyer) => ({
        id: lawyer.id.toString(),
        userId: lawyer.userId,
        cellphone: lawyer.cellphone,
        createdAt: lawyer.createdAt,
      })),
    };
  }
}
