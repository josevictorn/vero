import { left, right, type Either } from "@/core/either";
import { AccountNotFoundExistsError } from "./errors/acount-not-found-error";
import type { Account } from "../../enterprise/entities/account";
import type { AccountsRepository } from "../repositories/accounts-repository";

interface GetUserProfileUseCaseRequest {
  userId: string;
}

type GetUserProfileUseCaseResponse = Either<
  AccountNotFoundExistsError,
  {
    user: Account
  }
>

export class GetUserProfileUseCase {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  async execute({userId}: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const account = await this.accountsRepository.findById(userId);
    
    if (!account) {
      return left(new AccountNotFoundExistsError(userId));
    }

    return right({ user: account });
  }
}