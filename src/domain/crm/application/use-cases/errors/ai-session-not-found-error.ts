import { UseCaseError } from "@/core/errors/use-case-error";

export class AISessionNotFoundError extends Error implements UseCaseError {
    constructor() {
        super("AI session not found");
    }
}