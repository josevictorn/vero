import { Inject, Injectable } from "@nestjs/common";
import { type Either, left, right } from "@/core/either";
import { InvalidPageError } from "@/core/errors/errors/invalid-page-error";
import type { Account } from "../../enterprise/entities/account";
import { AccountsRepository } from "../repositories/accounts-repository";

interface FetchAccountsUseCaseRequest {
  page: number;
}

type FetchAccountsUseCaseResponse = Either<
  InvalidPageError,
  {
    accounts: Account[];
    meta: {
      currentPage: number;
      totalCount: number;
      perPage: number;
    };
  }
>;

@Injectable()
export class FetchAccountsUseCase {
  constructor(
    @Inject(AccountsRepository)
    private readonly accountsRepository: AccountsRepository
  ) {}

  async execute({
    page,
  }: FetchAccountsUseCaseRequest): Promise<FetchAccountsUseCaseResponse> {
    if (page < 1) {
      return left(new InvalidPageError());
    }

    const accounts = await this.accountsRepository.findMany({ page });

    return right({
      accounts: accounts.items,
      meta: {
        currentPage: page,
        totalCount: accounts.total,
        perPage: 20,
      },
    });
  }
}
