import { type Either, left, right } from "@/core/either";
import { Admin } from "../../enterprise/entities/admin";
import type { HashGenerator } from "../cryptography/hash-generator";
import type { AdminsRepository } from "../repositories/admins-repository";
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
