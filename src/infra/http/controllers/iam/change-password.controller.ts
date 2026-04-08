import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Inject,
  Param,
  Patch,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { z } from "zod";

import { ChangePasswordUseCase } from "@/domain/iam/application/use-cases/change-password";
import { AccountNotFoundExistsError } from "@/domain/iam/application/use-cases/errors/acount-not-found-error";
import { Public } from "@/infra/auth/public";
import { AccountPresenter } from "../../presenters/account-presenter";

const changePasswordBodySchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

type ChangePasswordBodySchema = z.infer<typeof changePasswordBodySchema>;

@ApiTags("Accounts")
@Controller("/accounts/:id/password")
@Public()
export class ChangePasswordController {
  constructor(
    @Inject(ChangePasswordUseCase)
    private readonly changePassword: ChangePasswordUseCase
  ) {}

  @Patch()
  @HttpCode(200)
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        currentPassword: {
          type: "string",
          example: "oldpassword123",
        },
        newPassword: {
          type: "string",
          example: "newpassword123",
        },
      },
      required: ["currentPassword", "newPassword"],
    },
  })
  @ApiResponse({
    status: 200,
    description: "Password changed successfully",
    schema: {
      type: "object",
      properties: {
        user: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            role: { type: "string" },
            isActive: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Validation failed or bad request",
  })
  @ApiResponse({
    status: 401,
    description: "Current password is incorrect",
  })
  async handle(
    @Param("id") id: string,
    @Body() body: ChangePasswordBodySchema
  ) {
    const { currentPassword, newPassword } = body;

    const result = await this.changePassword.execute({
      userId: id,
      currentPassword,
      newPassword,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case AccountNotFoundExistsError:
          throw new BadRequestException(error.message);

        default:
          throw new UnauthorizedException(error.message);
      }
    }

    const { account } = result.value;

    return {
      user: AccountPresenter.toHTTP(account),
    };
  }
}
