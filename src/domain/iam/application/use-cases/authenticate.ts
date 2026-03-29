import { Inject, Injectable } from "@nestjs/common";
import { type Either, left, right } from "@/core/either.ts";
import { Encrypter } from "../cryptography/encrypter.ts";
import { HashComparer } from "../cryptography/hash-comparer.ts";
import { AccountsRepository } from "../repositories/accounts-repository.ts";
import { WrongCredentialsError } from "./errors/wrong-credentials-error.ts";

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateUseCaseResponse = Either<
  WrongCredentialsError,
  { accessToken: string }
>;

@Injectable()
export class AuthenticateUseCase {
  constructor(
    @Inject(AccountsRepository)
    private readonly accountsRepository: AccountsRepository,
    @Inject(HashComparer)
    private readonly hashComparer: HashComparer,
    @Inject(Encrypter)
    private readonly encrypter: Encrypter
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const account = await this.accountsRepository.findByEmail(email);

    if (!account) {
      return left(new WrongCredentialsError());
    }

    const passwordMatches = await this.hashComparer.compare(
      password,
      account.password
    );

    if (!passwordMatches) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: account.id.toString(),
    });

    return right({ accessToken });
  }
}
