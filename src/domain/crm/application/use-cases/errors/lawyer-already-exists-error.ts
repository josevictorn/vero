import type { UseCaseError } from "@/core/errors/use-case-error";

export class LawyerAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super(`Lawyer already exists.`);
  }
}