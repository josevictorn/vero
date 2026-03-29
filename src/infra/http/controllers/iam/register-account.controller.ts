import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Inject,
  InternalServerErrorException,
  Post,
} from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserRole } from "generated/prisma/enums";
import { z } from "zod";
import { AccountAlreadyExistsError } from "@/domain/iam/application/use-cases/errors/account-already-exists-error";
import { RegisterAccountUseCase } from "@/domain/iam/application/use-cases/register-account";

const registerAccountBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  role: z.enum(UserRole),
  password: z.string().min(6),
});

type RegisterAccountBodySchema = z.infer<typeof registerAccountBodySchema>;

@ApiTags("Accounts")
@Controller("/accounts")
export class RegisterAccountController {
  constructor(
    @Inject(RegisterAccountUseCase)
    private readonly registerAccount: RegisterAccountUseCase
  ) {}

  @Post()
  @HttpCode(201)
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: { type: "string", example: "John Doe" },
        email: {
          type: "string",
          format: "email",
          example: "johndoe@example.com",
        },
        role: {
          type: "string",
          enum: [
            UserRole.ADMIN,
            UserRole.CLIENT,
            UserRole.ASSISTANT,
            UserRole.FINANCE,
            UserRole.LAWYER,
          ],
          example: UserRole.CLIENT,
        },
        password: { type: "string", minLength: 6, example: "password123" },
      },
      required: ["name", "email", "role", "password"],
    },
  })
  @ApiResponse({
    status: 201,
    description: "Account created successfully",
    schema: {
      type: "object",
      properties: {
        account: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            role: {
              type: "string",
              enum: [
                UserRole.ADMIN,
                UserRole.CLIENT,
                UserRole.ASSISTANT,
                UserRole.FINANCE,
                UserRole.LAWYER,
              ],
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Validation failed or other bad request error",
  })
  @ApiResponse({
    status: 409,
    description: "Account with the same email already exists",
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: 'Account "johndoe@example.com" already exists',
        },
      },
    },
  })
  async handle(@Body() body: RegisterAccountBodySchema) {
    const { name, email, role, password } = body;

    const result = await this.registerAccount.execute({
      name,
      email,
      role,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case AccountAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new InternalServerErrorException(error.message);
      }
    }
  }
}
