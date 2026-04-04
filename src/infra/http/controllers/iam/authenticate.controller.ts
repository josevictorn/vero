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
import { AuthenticateUseCase } from "@/domain/iam/application/use-cases/authenticate";
import { WrongCredentialsError } from "@/domain/iam/application/use-cases/errors/wrong-credentials-error";
import { Public } from "@/infra/auth/public";
import { AccountPresenter } from "../../presenters/account-presenter";

const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@ApiTags("Accounts")
@Controller("/accounts/authenticate")
@Public()
export class AuthenticateController {
  constructor(
    @Inject(AuthenticateUseCase)
    private readonly authenticate: AuthenticateUseCase
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
          example: "account@example.com",
        },
        password: { type: "string", minLength: 6, example: "password123" },
      },
      required: ["email", "password"],
    },
  })
  @ApiResponse({
    status: 200,
    description: "Account authenticated successfully",
    schema: {
      type: "object",
      properties: {
        access_token: { type: "string", description: "JWT token" },
        user: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            role: { type: "string" },
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
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;

    const result = await this.authenticate.execute({
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

    const { accessToken, user } = result.value;

    return { access_token: accessToken, user: AccountPresenter.toHTTP(user) };
  }
}
