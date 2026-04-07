import { UseCaseError } from "@/core/errors/use-case-error";

export class ScreeningFlowNotFoundError extends Error implements UseCaseError {
  constructor() {
    super("Screening flow not found.");
  }
}