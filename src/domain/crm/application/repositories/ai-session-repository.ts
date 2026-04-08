import { AISession } from "../../enterprise/entities/ai-session";

export abstract class AISessionRepository {
    abstract create(aiSession: AISession): Promise<void>;
    abstract findById(id: string): Promise<AISession | null>;
    abstract findAll(): Promise<AISession[]>;
    abstract update(aiSession: AISession): Promise<void>;
    abstract delete(aiSession: AISession): Promise<void>;
}