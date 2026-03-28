import { Injectable } from "@nestjs/common";
import { type Either, left, right } from "@/core/either";
import { Admin } from "../../enterprise/entities/admin";
// biome-ignore lint/style/useImportType: HashGenerator must be imported at runtime so NestJS can emit dependency injection metadata (emitDecoratorMetadata); using import type erases the symbol at build time and can break DI.
import { HashGenerator } from "../cryptography/hash-generator";
// biome-ignore lint/style/useImportType: AdminsRepository must be imported at runtime so NestJS can emit dependency injection metadata (emitDecoratorMetadata); using import type erases the symbol at build time and can break DI.
import { AdminsRepository } from "../repositories/admins-repository";
import { AdminAlreadyExistsError } from "./errors/admin-already-exists-error";

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
    private readonly adminsRepository: AdminsRepository,
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
