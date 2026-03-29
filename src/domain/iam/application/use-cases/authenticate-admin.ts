import { Inject, Injectable } from "@nestjs/common";
import { type Either, left, right } from "@/core/either.ts";
import { Encrypter } from "../cryptography/encrypter.ts";
import { HashComparer } from "../cryptography/hash-comparer.ts";
import { AdminsRepository } from "../repositories/admins-repository.ts";
import { WrongCredentialsError } from "./errors/wrong-credentials-error.ts";

interface AuthenticateAdminUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateAdminUseCaseResponse = Either<
  WrongCredentialsError,
  { accessToken: string }
>;

@Injectable()
export class AuthenticateAdminUseCase {
  constructor(
    @Inject(AdminsRepository)
    private readonly adminsRepository: AdminsRepository,
    @Inject(HashComparer)
    private readonly hashComparer: HashComparer,
    @Inject(Encrypter)
    private readonly encrypter: Encrypter
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateAdminUseCaseRequest): Promise<AuthenticateAdminUseCaseResponse> {
    const admin = await this.adminsRepository.findByEmail(email);

    if (!admin) {
      return left(new WrongCredentialsError());
    }

    const passwordMatches = await this.hashComparer.compare(
      password,
      admin.password
    );

    if (!passwordMatches) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: admin.id.toString(),
    });

    return right({ accessToken });
  }
}
