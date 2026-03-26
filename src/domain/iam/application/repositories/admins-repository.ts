import type { Admin } from "../../enterprise/entities/admin";

export abstract class AdminsRepository {
  abstract findByEmail(Email: string): Promise<Admin | null>;
  abstract create(admin: Admin): Promise<void>;
}
