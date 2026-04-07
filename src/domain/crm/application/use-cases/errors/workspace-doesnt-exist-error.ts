import { UseCaseError } from "@/core/errors/use-case-error";

export class WorkspaceDoesntExistError extends Error implements UseCaseError {
  constructor() {
    super("Workspace doesn't exist.");
  }
}