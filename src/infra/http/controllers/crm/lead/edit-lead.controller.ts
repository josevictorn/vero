import { EditLeadUseCase } from "@/domain/crm/application/use-cases/lead/edit-lead";
import { LawyerNotFoundError } from "@/domain/crm/application/use-cases/errors/lawyer-not-found-error";
import { LeadNotFoundError } from "@/domain/crm/application/use-cases/errors/lead-not-found-error";
import { Body, Controller, HttpCode, Param, Put, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { z } from "zod";
import { ZodValidationPipe } from "../../../pipes/zod-validation-pipe";

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
  constructor(private editLead: EditLeadUseCase) {}

  @Put()
  @HttpCode(200)
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        email: { type: "string", format: "email" },
        cellphone: { type: "string" },
        lawyerId: { type: "string", format: "uuid", nullable: true },
      },
      required: ["name", "email", "cellphone"],
    },
  })
  @ApiResponse({ status: 200, description: "Lead updated successfully" })
  @ApiResponse({ status: 404, description: "Lead or Lawyer not found" })
  async handle(@Param("id") id: string, @Body(new ZodValidationPipe(editLeadBodySchema)) body: EditLeadBodySchema) {
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
  }
}
