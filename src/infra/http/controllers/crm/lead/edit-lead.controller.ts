import { EditLeadUseCase } from "@/domain/crm/application/use-cases/lead/edit-lead";
import { LawyerNotFoundError } from "@/domain/crm/application/use-cases/errors/lawyer-not-found-error";
import { LeadNotFoundError } from "@/domain/crm/application/use-cases/errors/lead-not-found-error";
import { Body, Controller, HttpCode, Inject, Param, Put, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { ApiBody, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { z } from "zod";
import { ZodValidationPipe } from "../../../pipes/zod-validation-pipe";

const editLeadParamsSchema = z.object({
  id: z.uuid(),
});

type EditLeadParamsSchema = z.infer<typeof editLeadParamsSchema>;

const editLeadBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  cellphone: z.string(),
  lawyerId: z.string().uuid().optional().nullable(),
});

type EditLeadBodySchema = z.infer<typeof editLeadBodySchema>;

@ApiTags("Leads")
@Controller("/leads/:id")
export class EditLeadController {
  constructor(
    @Inject(EditLeadUseCase)
    private editLead: EditLeadUseCase
  ) {}

  @Put()
  @HttpCode(200)
  @ApiParam({ name: "id", type: "string", example: "123e4567-e89b-12d3-a456-426614174000" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: { type: "string", example: "João da Silva" },
        email: { type: "string", format: "email", example: "joao@email.com" },
        cellphone: { type: "string", example: "11999999999" },
        lawyerId: { type: "string", format: "uuid", nullable: true, example: "123e4567-e89b-12d3-a456-426614174000" },
      },
      required: ["name", "email", "cellphone"],
    },
  })
  @ApiResponse({ status: 200, description: "Lead updated successfully" })
  @ApiResponse({ status: 404, description: "Lead or Lawyer not found" })
  async handle(
    @Param(new ZodValidationPipe(editLeadParamsSchema)) params: EditLeadParamsSchema,
    @Body(new ZodValidationPipe(editLeadBodySchema)) body: EditLeadBodySchema,
  ) {
    const { id } = params;
    const { name, email, cellphone, lawyerId } = body;

    const result = await this.editLead.execute({
      id,
      name,
      email,
      cellphone,
      lawyerId,
    });

    if (result.isLeft()) {
      const error = result.value;
      
      switch (error.constructor) {
        case LeadNotFoundError:
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
