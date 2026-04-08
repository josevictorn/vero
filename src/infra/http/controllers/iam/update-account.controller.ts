import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Inject,
  Param,
  Put,
} from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { z } from "zod";

import { UpdateAccountUseCase } from "@/domain/iam/application/use-cases/update-account";
import { AccountNotFoundExistsError } from "@/domain/iam/application/use-cases/errors/acount-not-found-error";
import { AccountPresenter } from "../../presenters/account-presenter";

const UpdateAccountBodySchema = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
});

type UpdateAccountBodySchema = z.infer<typeof UpdateAccountBodySchema>;

@ApiTags("Accounts")
@Controller("/accounts/:id")
export class UpdateAccountController {
  constructor(
    @Inject(UpdateAccountUseCase)
    private readonly updateAccount: UpdateAccountUseCase
  ) {}

  @Put()
  @HttpCode(200)
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          example: "John Doe",
        },
        email: {
          type: "string",
          format: "email",
          example: "john@example.com",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Account updated successfully",
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
  async handle(
    @Param("id") id: string,
    @Body() body: UpdateAccountBodySchema
  ) {
    const { name, email } = body;

    const result = await this.updateAccount.execute({
      accountId: id,
      name,
      email,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case AccountNotFoundExistsError:
          throw new BadRequestException(error.message);

        default:
          throw new BadRequestException(error.message);
      }
    }

    const { account } = result.value;

    return {
      user: AccountPresenter.toHTTP(account),
    };
  }
}
