import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  UseGuards,
} from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { AccountNotFoundExistsError } from "@/domain/iam/application/use-cases/errors/acount-not-found-error";
import { GetUserProfileUseCase } from "@/domain/iam/application/use-cases/get-user-profile";
import { UserRole } from "@/domain/iam/enterprise/entities/value-objects/user-role";
import { Action } from "@/infra/auth/casl/actions";
import { CheckPolicies } from "@/infra/auth/casl/check-policies.decorator";
import { PoliciesGuard } from "@/infra/auth/casl/policies.guard";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { AccountPresenter } from "../../presenters/account-presenter";

@ApiTags("Accounts")
@Controller("/accounts/profile")
@UseGuards(PoliciesGuard)
export class GetUserProfileController {
  constructor(
    @Inject(GetUserProfileUseCase)
    private readonly getUserProfile: GetUserProfileUseCase
  ) {}

  @Get()
  @HttpCode(200)
  @CheckPolicies((ability) => ability.can(Action.Read, "Account"))
  @ApiResponse({
    status: 200,
    schema: {
      type: "object",
      properties: {
        user: {
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
            isActive: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Account not found",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "Account with ID 123 not found" },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: "Internal server error",
  })
  async handle(@CurrentUser() userPayload: UserPayload) {
    const result = await this.getUserProfile.execute({
      userId: userPayload.sub,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case AccountNotFoundExistsError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { user } = result.value;

    return { user: AccountPresenter.toHTTP(user) };
  }
}
