import type { Account } from "../../enterprise/entities/account";

export abstract class AccountsRepository {
  abstract findByEmail(Email: string): Promise<Account | null>;
  abstract create(account: Account): Promise<void>;
}
