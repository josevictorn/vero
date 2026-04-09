import { UseCaseError } from "@/core/errors/use-case-error";

export class LeadNotFoundError extends Error implements UseCaseError {
  constructor() {
    super("Lead not found.");
  }
}