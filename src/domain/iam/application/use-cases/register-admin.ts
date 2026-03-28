import { Inject, Injectable } from "@nestjs/common";
import { type Either, left, right } from "@/core/either.ts";
import { Admin } from "@/domain/iam/enterprise/entities/admin.ts";
import { HashGenerator } from "@/domain/iam/application/cryptography/hash-generator.ts";
import { AdminsRepository } from "@/domain/iam/application/repositories/admins-repository.ts";
import { AdminAlreadyExistsError } from "@/domain/iam/application/use-cases/errors/admin-already-exists-error.ts";

interface RegisterAdminUseCaseRequest {
  email: string;
  name: string;
  password: string;
}

type RegisterAdminUseCaseResponse = Either<
  AdminAlreadyExistsError,
  { admin: Admin }
>;

@Injectable()
export class RegisterAdminUseCase {
  constructor(
    @Inject(AdminsRepository)
    private readonly adminsRepository: AdminsRepository,
    @Inject(HashGenerator)
    private readonly hashGenerator: HashGenerator
  ) {}

  async execute({
    email,
    name,
    password,
  }: RegisterAdminUseCaseRequest): Promise<RegisterAdminUseCaseResponse> {
    const adminWithSameEmail = await this.adminsRepository.findByEmail(email);

    if (adminWithSameEmail) {
      return left(new AdminAlreadyExistsError(email));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const admin = Admin.create({
      email,
      name,
      password: hashedPassword,
    });

    await this.adminsRepository.create(admin);

    return right({ admin });
  }
}
