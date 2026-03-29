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
import { z } from "zod";
import { AccountAlreadyExistsError } from "@/domain/iam/application/use-cases/errors/account-already-exists-error";
import { RegisterAccountUseCase } from "@/domain/iam/application/use-cases/register-account";
import { UserRole } from "@/domain/iam/enterprise/entities/value-objects/user-role";

const registerAccountBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  role: z.enum(UserRole),
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
      },
      required: ["name", "email", "role"],
    },
  })
  @ApiResponse({
    status: 201,
    description: "Account created successfully",
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
    const { name, email, role } = body;

    const result = await this.registerAccount.execute({
      name,
      email,
      role,
      password: "default-password", // You should implement a proper password handling strategy
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
