import type { PaginatedResult } from "@/core/repositories/paginated-result";
import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { Account } from "../../enterprise/entities/account";

export abstract class AccountsRepository {
  abstract findByEmail(email: string): Promise<Account | null>;
  abstract findById(id: string): Promise<Account | null>;
  abstract findMany(
    params: PaginationParams
  ): Promise<PaginatedResult<Account>>;
  abstract create(account: Account): Promise<void>;
  abstract save(account: Account): Promise<void>;
}
