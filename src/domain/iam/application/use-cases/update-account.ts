import { Inject, Injectable } from "@nestjs/common";
import { type Either, left, right } from "@/core/either";
import type { Account } from "../../enterprise/entities/account";
import { AccountsRepository } from "../repositories/accounts-repository";
import { AccountNotFoundExistsError } from "./errors/acount-not-found-error";
import { EmailAlreadyInUseError } from "./errors/email-already-in-use-error";

interface UpdateAccountUseCaseRequest {
  accountId: string;
  email?: string;
  name?: string;
}

type UpdateAccountUseCaseResponse = Either<
  AccountNotFoundExistsError,
  { account: Account }
>;

@Injectable()
export class UpdateAccountUseCase {
  constructor(
    @Inject(AccountsRepository)
    private readonly accountsRepository: AccountsRepository
  ) {}

  async execute({
    accountId,
    name,
    email,
  }: UpdateAccountUseCaseRequest): Promise<UpdateAccountUseCaseResponse> {
    const account = await this.accountsRepository.findById(accountId);

    if (!account) {
      return left(new AccountNotFoundExistsError(accountId));
    }

    if (email) {
      const accountWithSameEmail =
        await this.accountsRepository.findByEmail(email);

      if (
        accountWithSameEmail &&
        accountWithSameEmail.id.toString() !== accountId
      ) {
        return left(new EmailAlreadyInUseError(email));
      }
    }

    account.email = email || account.email;
    account.name = name || account.name;

    await this.accountsRepository.save(account);

    return right({ account });
  }
}
