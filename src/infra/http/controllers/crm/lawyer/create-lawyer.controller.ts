import { CreateLawyerUseCase } from "@/domain/crm/application/use-cases/lawyer/create-lawyer";
import { LawyerAlreadyExistsError } from "@/domain/crm/application/use-cases/errors/lawyer-already-exists-error";
import { WorkspaceDoesntExistError } from "@/domain/crm/application/use-cases/errors/workspace-doesnt-exist-error";
import { Controller, Inject, Post, HttpCode, Body, ConflictException, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { z } from "zod";
import { ZodValidationPipe } from "../../../pipes/zod-validation-pipe";

const createLawyerBodySchema = z.object({
  userId: z.uuid(),
  cellphone: z.string(),
});

type CreateLawyerBodySchema = z.infer<typeof createLawyerBodySchema>;

@ApiTags("Lawyers")
@Controller("/lawyers")
export class CreateLawyerController {
  constructor(
    @Inject(CreateLawyerUseCase)
    private createLawyer: CreateLawyerUseCase
  ) {}

  @Post()
  @HttpCode(201)
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        userId: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        cellphone: { type: "string", example: "11999999999" },
      },
      required: ["userId", "cellphone"],
    },
  })
  @ApiResponse({ status: 201, description: "Lawyer profile created successfully" })
  @ApiResponse({ status: 409, description: "User is already a lawyer" })
  @ApiResponse({ status: 404, description: "Default workspace not synced" })
  async handle(@Body(new ZodValidationPipe(createLawyerBodySchema)) body: CreateLawyerBodySchema) {
    const { userId, cellphone } = body;

    const result = await this.createLawyer.execute({
      userId,
      cellphone,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case LawyerAlreadyExistsError:
          throw new ConflictException(error.message);
        case WorkspaceDoesntExistError:
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
