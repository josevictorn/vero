import type { UseCaseError } from "@/core/errors/use-case-error.ts";

export class AdminAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Admin "${identifier}" already exists.`);
  }
}
