import type { AdminsRepository } from "@/domain/iam/application/repositories/admins-repository";
import type { Admin } from "@/domain/iam/enterprise/entities/admin";

export class InMemoryAdminsRepository implements AdminsRepository {
  // biome-ignore lint/style/useConsistentMemberAccessibility: This is a test class, so we can keep the items array public for easier access in tests.
  public items: Admin[] = [];

  findByEmail(email: string) {
    const admin = this.items.find((item) => item.email === email);

    if (!admin) {
      return Promise.resolve(null);
    }

    return Promise.resolve(admin);
  }

  create(admin: Admin) {
    this.items.push(admin);
    return Promise.resolve();
  }
}
