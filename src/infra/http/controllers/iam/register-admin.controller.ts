import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Inject,
  Post,
  UsePipes,
} from "@nestjs/common";
import { z } from "zod";
import { AdminAlreadyExistsError } from "@/domain/iam/application/use-cases/errors/admin-already-exists-error.ts";
import { RegisterAdminUseCase } from "@/domain/iam/application/use-cases/register-admin.ts";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe.ts";

const registerAdminBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6),
});

type RegisterAdminBodySchema = z.infer<typeof registerAdminBodySchema>;

@Controller("/accounts/admin")
export class RegisterAdminController {
  constructor(
    @Inject(RegisterAdminUseCase)
    private readonly registerAdmin: RegisterAdminUseCase
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(registerAdminBodySchema))
  async handle(@Body() body: RegisterAdminBodySchema) {
    const { name, email, password } = body;

    const result = await this.registerAdmin.execute({
      name,
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case AdminAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
