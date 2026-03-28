import type { Admin } from "@/domain/iam/enterprise/entities/admin.ts";

export abstract class AdminsRepository {
  abstract findByEmail(Email: string): Promise<Admin | null>;
  abstract create(admin: Admin): Promise<void>;
}
