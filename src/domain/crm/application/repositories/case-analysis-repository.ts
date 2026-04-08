import { CaseAnalysis } from "../../enterprise/entities/case-analysis";

export abstract class CaseAnalysisRepository {
    abstract create(caseAnalysis: CaseAnalysis): Promise<void>;
    abstract findById(id: string): Promise<CaseAnalysis | null>;
    abstract findAll(): Promise<CaseAnalysis[]>;
    abstract update(caseAnalysis: CaseAnalysis): Promise<void>;
    abstract delete(caseAnalysis: CaseAnalysis): Promise<void>;
    abstract findByAiSessionId(aiSessionId: string): Promise<CaseAnalysis | null>;
}