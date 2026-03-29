import { Inject, Injectable } from "@nestjs/common";
import type { UserRole } from "@prisma/client";
import { type Either, left, right } from "@/core/either";
import { Account } from "../../enterprise/entities/account";
import { HashGenerator } from "../cryptography/hash-generator";
import { AccountsRepository } from "../repositories/accounts-repository";
import { AccountAlreadyExistsError } from "./errors/account-already-exists-error";

interface RegisterAccountUseCaseRequest {
  email: string;
  name: string;
  password: string;
  role: UserRole;
}

type RegisterAccountUseCaseResponse = Either<
  AccountAlreadyExistsError,
  { account: Account }
>;

@Injectable()
export class RegisterAccountUseCase {
  constructor(
    @Inject(AccountsRepository)
    private readonly accountsRepository: AccountsRepository,
    @Inject(HashGenerator)
    private readonly hashGenerator: HashGenerator
  ) {}

  async execute({
    email,
    name,
    password,
    role,
  }: RegisterAccountUseCaseRequest): Promise<RegisterAccountUseCaseResponse> {
    const accountWithSameEmail =
      await this.accountsRepository.findByEmail(email);

    if (accountWithSameEmail) {
      return left(new AccountAlreadyExistsError(email));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const account = Account.create({
      email,
      name,
      role,
      password: hashedPassword,
    });

    await this.accountsRepository.create(account);

    return right({ account });
  }
}
