import type { UseCaseError } from "@/core/errors/use-case-error.ts";

export class InvalidPageError extends Error implements UseCaseError {
  constructor() {
    super("Invalid page number.");
  }
}
