import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Inject,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { z } from "zod";
import { InvalidPageError } from "@/core/errors/errors/invalid-page-error";
import { FetchAccountsUseCase } from "@/domain/iam/application/use-cases/fetch-accounts";
import { Action } from "@/infra/auth/casl/actions";
import { CheckPolicies } from "@/infra/auth/casl/check-policies.decorator";
import { PoliciesGuard } from "@/infra/auth/casl/policies.guard";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { AccountPresenter } from "../../presenters/account-presenter";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@ApiTags("Accounts")
@Controller("/accounts")
@UseGuards(PoliciesGuard)
export class FetchAccountsController {
  constructor(
    @Inject(FetchAccountsUseCase)
    private readonly fetchAccounts: FetchAccountsUseCase
  ) {}

  @Get()
  @HttpCode(200)
  @CheckPolicies((ability) => ability.can(Action.Read, "Account"))
  @ApiResponse({
    status: 200,
    schema: {
      type: "object",
      properties: {
        accounts: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              name: { type: "string" },
              email: { type: "string", format: "email" },
              role: { type: "string" },
            },
          },
        },
        meta: {
          type: "object",
          properties: {
            currentPage: { type: "number" },
            totalCount: { type: "number" },
            perPage: { type: "number" },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Invalid page number",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "Invalid page number" },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: "Internal server error",
  })
  async handle(@Query("page", queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchAccounts.execute({ page });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case InvalidPageError:
          throw new InvalidPageError();
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accounts, meta } = result.value;

    return {
      accounts: accounts.map(AccountPresenter.toHTTP),
      meta,
    };
  }
}
