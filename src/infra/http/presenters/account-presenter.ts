import type { Account } from "@/domain/iam/enterprise/entities/account";

export class AccountPresenter {
  static toHTTP(account: Account) {
    return {
      id: account.id.toString(),
      name: account.name,
      email: account.email,
      role: account.role,
    };
  }
}