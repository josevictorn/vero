import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from "@nestjs/common";
import { z } from "zod";
import { AdminAlreadyExistsError } from "@/domain/iam/application/use-cases/errors/admin-already-exists-error";
// biome-ignore lint/style/useImportType: RegisterAdminUseCase must be imported at runtime so NestJS can emit dependency injection metadata (emitDecoratorMetadata); using import type erases the symbol at build time and can break DI.
import { RegisterAdminUseCase } from "@/domain/iam/application/use-cases/register-admin";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";

const registerAdminBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6),
});

type RegisterAdminBodySchema = z.infer<typeof registerAdminBodySchema>;

@Controller("/accounts/admin")
export class RegisterAdminController {
  constructor(private readonly registerAdmin: RegisterAdminUseCase) {}

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
