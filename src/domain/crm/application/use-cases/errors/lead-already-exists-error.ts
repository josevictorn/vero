import type { UseCaseError } from "@/core/errors/use-case-error";

export class LeadAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Lead "${identifier}" already exists.`);
  }
}