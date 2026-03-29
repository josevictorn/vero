import type { UseCaseError } from "@/core/errors/use-case-error.ts";

export class AccountAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Account "${identifier}" already exists.`);
  }
}
