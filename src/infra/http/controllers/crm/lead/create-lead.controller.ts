import { CreateLeadUseCase } from "@/domain/crm/application/use-cases/lead/create-lead";
import { LawyerNotFoundError } from "@/domain/crm/application/use-cases/errors/lawyer-not-found-error";
import { WorkspaceDoesntExistError } from "@/domain/crm/application/use-cases/errors/workspace-doesnt-exist-error";
import {
  Body,
  Controller,
  HttpCode,
  Post,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { z } from "zod";
import { ZodValidationPipe } from "../../../pipes/zod-validation-pipe";

const createLeadBodySchema = z.object({
  lawyerId: z.string().uuid().optional().nullable(),
  name: z.string(),
  cellphone: z.string(),
  email: z.string().email(),
});

type CreateLeadBodySchema = z.infer<typeof createLeadBodySchema>;

@ApiTags("Leads")
@Controller("/leads")
export class CreateLeadController {
  constructor(private createLead: CreateLeadUseCase) {}

  @Post()
  @HttpCode(201)
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        lawyerId: { type: "string", format: "uuid", nullable: true },
        name: { type: "string" },
        cellphone: { type: "string" },
        email: { type: "string", format: "email" },
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
  }
}
