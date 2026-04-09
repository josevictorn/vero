import { CreateLeadUseCase } from "@/domain/crm/application/use-cases/lead/create-lead";
import { LawyerNotFoundError } from "@/domain/crm/application/use-cases/errors/lawyer-not-found-error";
import { WorkspaceDoesntExistError } from "@/domain/crm/application/use-cases/errors/workspace-doesnt-exist-error";
import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { z } from "zod";
import { ZodValidationPipe } from "../../../pipes/zod-validation-pipe";

const createLeadBodySchema = z.object({
  lawyerId: z.uuid().optional().nullable(),
  name: z.string(),
  cellphone: z.string(),
  email: z.email(),
});

type CreateLeadBodySchema = z.infer<typeof createLeadBodySchema>;

@ApiTags("Leads")
@Controller("/leads")
export class CreateLeadController {
  constructor(
    @Inject(CreateLeadUseCase)
    private createLead: CreateLeadUseCase
  ) {}

  @Post()
  @HttpCode(201)
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        lawyerId: { type: "string", format: "uuid", nullable: true, example: "123e4567-e89b-12d3-a456-426614174000" },
        name: { type: "string", example: "João da Silva" },
        cellphone: { type: "string", example: "11999999999" },
        email: { type: "string", format: "email", example: "joao@email.com" },
      },
      required: ["name", "cellphone", "email"],
    },
  })
  @ApiResponse({ status: 201, description: "Lead created successfully" })
  @ApiResponse({ status: 404, description: "Default workspace or lawyer not found" })
  async handle(@Body(new ZodValidationPipe(createLeadBodySchema)) body: CreateLeadBodySchema) {
    const { lawyerId, name, cellphone, email } = body;

    const result = await this.createLead.execute({
      lawyerId,
      name,
      cellphone,
      email,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WorkspaceDoesntExistError:
          throw new NotFoundException(error.message);
        case LawyerNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new InternalServerErrorException(error.message);
      }
    }

    const { lead } = result.value;

    return {
      lead: {
        id: lead.id.toString(),
        workspaceId: lead.workspaceId,
        lawyerId: lead.lawyerId,
        name: lead.name,
        cellphone: lead.cellphone,
        email: lead.email,
        createdAt: lead.createdAt,
      },
    };
  }
}
