import type { UseCaseError } from "@/core/errors/use-case-error.ts";

export class AccountNotFoundExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Account "${identifier}" not found.`);
  }
}
