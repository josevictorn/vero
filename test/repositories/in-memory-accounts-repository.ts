import type { AccountsRepository } from "@/domain/iam/application/repositories/accounts-repository";
import type { Account } from "@/domain/iam/enterprise/entities/account";
import type { Admin } from "@/domain/iam/enterprise/entities/admin.ts";

export class InMemoryAccountsRepository implements AccountsRepository {
  // biome-ignore lint/style/useConsistentMemberAccessibility: This is a test class, so we can keep the items array public for easier access in tests.
  public items: Account[] = [];

  findByEmail(email: string) {
    const admin = this.items.find((item) => item.email === email);

    if (!admin) {
      return Promise.resolve(null);
    }

    return Promise.resolve(admin);
  }

  findById(id: string) {
    const account = this.items.find((item) => item.id.toString() === id);

    if (!account) {
      return Promise.resolve(null);
    }

    return Promise.resolve(account);
  }

  create(admin: Admin) {
    this.items.push(admin);
    return Promise.resolve();
  }
}
