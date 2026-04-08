import { Account } from "../../enterprise/entities/account"
import { type Either, left, right } from "@/core/either";
import {AccountNotFoundExistsError} from "./errors/acount-not-found-error";
import {Inject, Injectable} from "@nestjs/common";
import {AccountsRepository} from "../repositories/accounts-repository";

interface UpdateAccountUseCaseRequest {
    accountId: string,
    name?: string,
    email?: string
}

type UpdateAccountUseCaseResponse = Either<
  AccountNotFoundExistsError,
  { account: Account }
>;

@Injectable()
export class UpdateAccountUseCase {
  constructor(
    @Inject(AccountsRepository)
    private readonly accountsRepository: AccountsRepository,
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

    if (!name && !email) {
      return left(new Error("No data provided"));
    }

    if (email) {
      const accountWithSameEmail =
        await this.accountsRepository.findByEmail(email);

      if (
        accountWithSameEmail &&
        accountWithSameEmail.id.toString() !== accountId
      ) {
        return left(new Error("Email already in use"));
      }
    }

    account.update({
      name,
      email,
    });

    await this.accountsRepository.save(account);

    return right({ account });
  }
}
