import { UseCaseError } from "@/core/errors/use-case-error";


export class CaseAnalysisNotFoundError extends Error implements UseCaseError {
    constructor() {
        super("Case analysis not found");
    }
}
