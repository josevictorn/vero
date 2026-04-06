import { CreateLawyerUseCase } from "@/domain/crm/application/use-cases/create-lawyer";
import {
  Body,
  Controller,
  HttpCode,
  Post,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { z } from "zod";

const createLawyerBodySchema = z.object({
  userId: z.string().uuid(),
  cellphone: z.string(),
});

type CreateLawyerBodySchema = z.infer<typeof createLawyerBodySchema>;

@ApiTags("Lawyers")
@Controller("/lawyers")
export class CreateLawyerController {
  constructor(private createLawyer: CreateLawyerUseCase) {}

  @Post()
  @HttpCode(201)
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        userId: { type: "string", format: "uuid" },
        cellphone: { type: "string" },
      },
      required: ["userId", "cellphone"],
    },
  })
  @ApiResponse({ status: 201, description: "Lawyer profile created successfully" })
  @ApiResponse({ status: 409, description: "User is already a lawyer" })
  @ApiResponse({ status: 404, description: "Default workspace not synced" })
  async handle(@Body() body: CreateLawyerBodySchema) {
    const { userId, cellphone } = body;

    const result = await this.createLawyer.execute({
      userId,
      cellphone,
    });

    if (result.isLeft()) {
      const error = result.value;
      if (error.message.includes("already registered")) {
        throw new ConflictException(error.message);
      }
      if (error.message.includes("not seeded")) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
