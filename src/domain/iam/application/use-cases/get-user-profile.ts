import { left, right, type Either } from "@/core/either";
import { AccountNotFoundExistsError } from "./errors/acount-not-found-error";
import type { Account } from "../../enterprise/entities/account";
import { AccountsRepository } from "../repositories/accounts-repository";
import { Inject, Injectable } from "@nestjs/common";

interface GetUserProfileUseCaseRequest {
  userId: string;
}

type GetUserProfileUseCaseResponse = Either<
  AccountNotFoundExistsError,
  {
    user: Account
  }
>

@Injectable()
export class GetUserProfileUseCase {
  constructor(
    @Inject(AccountsRepository) 
    private readonly accountsRepository: AccountsRepository
  ) {}

  async execute({userId}: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const account = await this.accountsRepository.findById(userId);
    
    if (!account) {
      return left(new AccountNotFoundExistsError(userId));
    }

    return right({ user: account });
  }
}