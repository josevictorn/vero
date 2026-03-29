import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { z } from "zod";
import { AuthenticateAdminUseCase } from "@/domain/iam/application/use-cases/authenticate-admin";
import { WrongCredentialsError } from "@/domain/iam/application/use-cases/errors/wrong-credentials-error";

const authenticateAdminBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

type AuthenticateAdminBodySchema = z.infer<typeof authenticateAdminBodySchema>;

@ApiTags("Accounts")
@Controller("/accounts/admin/authenticate")
export class AuthenticateAdminController {
  constructor(
    @Inject(AuthenticateAdminUseCase)
    private readonly authenticateAdmin: AuthenticateAdminUseCase
  ) {}

  @Post()
  @HttpCode(200)
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        email: {
          type: "string",
          format: "email",
          example: "admin@example.com",
        },
        password: { type: "string", minLength: 6, example: "password123" },
      },
      required: ["email", "password"],
    },
  })
  @ApiResponse({
    status: 200,
    description: "Admin authenticated successfully",
    schema: {
      type: "object",
      properties: {
        access_token: { type: "string", description: "JWT token" },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Validation failed or other bad request error",
  })
  @ApiResponse({
    status: 401,
    description: "Invalid email or password",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 401 },
        error: { type: "string", example: "Unauthorized" },
        message: { type: "string", example: "Credentials are not valid." },
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
  async handle(@Body() body: AuthenticateAdminBodySchema) {
    const { email, password } = body;

    const result = await this.authenticateAdmin.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = result.value;

    return { access_token: accessToken };
  }
}
