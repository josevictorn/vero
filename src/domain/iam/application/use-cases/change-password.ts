import { Inject, Injectable } from "@nestjs/common";
import { type Either, left, right } from "@/core/either";
import type { Account } from "../../enterprise/entities/account";
import { HashComparer } from "../cryptography/hash-comparer";
import { HashGenerator } from "../cryptography/hash-generator";
import { AccountsRepository } from "../repositories/accounts-repository";
import { AccountNotFoundExistsError } from "./errors/acount-not-found-error";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";

interface ChangePasswordUseCaseRequest {
  accountId: string;
  currentPassword: string;
  newPassword: string;
}

type ChangePasswordUseCaseResponse = Either<
  AccountNotFoundExistsError | WrongCredentialsError,
  { account: Account }
>;

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject(AccountsRepository)
    private readonly accountsRepository: AccountsRepository,
    @Inject(HashGenerator)
    private readonly hashGenerator: HashGenerator,
    @Inject(HashComparer)
    private readonly hashComparer: HashComparer
  ) {}

  async execute({
    accountId,
    currentPassword,
    newPassword,
  }: ChangePasswordUseCaseRequest): Promise<ChangePasswordUseCaseResponse> {
    const account = await this.accountsRepository.findById(accountId);

    if (!account || accountId !== account.id.toString()) {
      return left(new AccountNotFoundExistsError(accountId));
    }

    const isValidCurrentPassword = await this.hashComparer.compare(
      currentPassword,
      account.password
    );

    if (!isValidCurrentPassword) {
      return left(new WrongCredentialsError());
    }

    const hashedNewPassword = await this.hashGenerator.hash(newPassword);

    account.password = hashedNewPassword;

    await this.accountsRepository.save(account);

    return right({ account });
  }
}
