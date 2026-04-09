import { UseCaseError } from "@/core/errors/use-case-error";

export class AISessionAlreadyExistsError extends Error implements UseCaseError {
    constructor() {
        super("AI session already exists");
    }
}