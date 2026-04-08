import type { UseCaseError } from "@/core/errors/use-case-error";

export class EmailAlreadyInUseError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`The email "${identifier}" already in use.`);
  }
}
