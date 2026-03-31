import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Inject,
  Post,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { z } from "zod";
import { AdminAlreadyExistsError } from "@/domain/iam/application/use-cases/errors/admin-already-exists-error.ts";
import { RegisterAdminUseCase } from "@/domain/iam/application/use-cases/register-admin.ts";
import { Action } from "@/infra/auth/casl/actions";
import { CheckPolicies } from "@/infra/auth/casl/check-policies.decorator";
import { PoliciesGuard } from "@/infra/auth/casl/policies.guard";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe.ts";

const registerAdminBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6),
});

type RegisterAdminBodySchema = z.infer<typeof registerAdminBodySchema>;

@ApiTags("Accounts")
@Controller("/accounts/admin")
export class RegisterAdminController {
  constructor(
    @Inject(RegisterAdminUseCase)
    private readonly registerAdmin: RegisterAdminUseCase
  ) {}

  @Post()
  @HttpCode(201)
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Create, "Account"))
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: { type: "string", example: "John Doe" },
        email: {
          type: "string",
          format: "email",
          example: "john.doe@example.com",
        },
        password: { type: "string", minLength: 6, example: "password123" },
      },
      required: ["name", "email", "password"],
    },
  })
  @ApiResponse({
    status: 201,
    description: "Admin account created successfully",
    schema: {
      type: "object",
      properties: {
        admin: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
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
    status: 403,
    description:
      "Forbidden. The user does not have permission to create accounts.",
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Forbidden resource",
        },
        error: {
          type: "string",
          example: "Forbidden",
        },
        statusCode: {
          type: "number",
          example: 403,
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: "Admin with the same email already exists",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 409 },
        message: {
          type: "string",
          example: "Admin with email john.doe@example.com already exists",
        },
        error: { type: "string", example: "Conflict" },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: "Internal server error",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 500 },
        message: { type: "string", example: "Internal server error" },
      },
    },
  })
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
