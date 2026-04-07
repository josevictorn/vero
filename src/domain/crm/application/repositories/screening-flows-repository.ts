import { ScreeningFlow } from "../../enterprise/entities/screening-flow";

export abstract class ScreeningFlowsRepository {
    abstract create(screeningFlow: ScreeningFlow): Promise<void>;
    abstract update(screeningFlow: ScreeningFlow): Promise<void>;
    abstract delete(screeningFlow: ScreeningFlow): Promise<void>;
    abstract findById(id: string): Promise<ScreeningFlow | null>;
    abstract findAll(): Promise<ScreeningFlow[]>;
}
