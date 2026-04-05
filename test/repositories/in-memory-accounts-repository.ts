import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { AccountsRepository } from "@/domain/iam/application/repositories/accounts-repository";
import type { Account } from "@/domain/iam/enterprise/entities/account";

export class InMemoryAccountsRepository implements AccountsRepository {
  // biome-ignore lint/style/useConsistentMemberAccessibility: This is a test class, so we can keep the items array public for easier access in tests.
  public items: Account[] = [];

  findByEmail(email: string) {
    const account = this.items.find((item) => item.email === email);

    if (!account) {
      return Promise.resolve(null);
    }

    return Promise.resolve(account);
  }

  findById(id: string) {
    const account = this.items.find((item) => item.id.toString() === id);

    if (!account) {
      return Promise.resolve(null);
    }

    return Promise.resolve(account);
  }

  findMany(params: PaginationParams) {
    const accounts = this.items.slice((params.page - 1) * 20, params.page * 20);

    return Promise.resolve({
      items: accounts,
      total: this.items.length,
    });
  }

  create(account: Account) {
    this.items.push(account);
    return Promise.resolve();
  }
}
