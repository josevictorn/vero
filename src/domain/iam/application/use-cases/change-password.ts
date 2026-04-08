import { type Either, left, right } from "@/core/either";
import { Account } from "../../enterprise/entities/account"
import {AccountNotFoundExistsError} from "./errors/acount-not-found-error";
import {Inject, Injectable} from "@nestjs/common";
import {AccountsRepository} from "../repositories/accounts-repository";
import {HashGenerator} from "../cryptography/hash-generator";
import {HashComparer} from "../cryptography/hash-comparer";

interface ChangePasswordUseCaseRequest {
    accountId: string,
    currentPassword: string,
    newPassword: string
}

type ChangePasswordUseCaseResponse = Either<
  AccountNotFoundExistsError,
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
        newPassword
    }: ChangePasswordUseCaseRequest): Promise<ChangePasswordUseCaseResponse>
    {
        const account = await this.accountsRepository.findById(accountId);

        if (!account) {
            return left(new AccountNotFoundExistsError(accountId));
        }

        const isValidCurrentPassword = await this.hashComparer.compare(currentPassword,
                                                                       account.password);

        if (!isValidCurrentPassword) {
            return left(new Error("Current password is incorrect"));
        }
        
        const hashedNewPassword = await this.hashGenerator.hash(newPassword);

        account.updatePassword(hashedNewPassword);

        await this.accountsRepository.save(account);

        return right({ account });
    }
}
