import { UseCaseError } from "@/core/errors/use-case-error";

export class LawyerNotFoundError extends Error implements UseCaseError {
  constructor() {
    super("Lawyer not found.");
  }
}