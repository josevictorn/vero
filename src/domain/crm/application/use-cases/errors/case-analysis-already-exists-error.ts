import { UseCaseError } from "@/core/errors/use-case-error";


export class CaseAnalysisAlreadyExistsError extends Error implements UseCaseError {
    constructor() {
        super("Case analysis already exists");
    }
}