import type { ScreeningFlowsRepository } from "@/domain/crm/application/repositories/screening-flows-repository";
import type { ScreeningFlow } from "@/domain/crm/enterprise/entities/screening-flow";

export class InMemoryScreeningFlowsRepository implements ScreeningFlowsRepository {
  public items: ScreeningFlow[] = [];

  async findById(id: string): Promise<ScreeningFlow | null> {
    const screeningFlow = this.items.find((item) => item.id.toString() === id);

    if (!screeningFlow) {
      return null;
    }

    return screeningFlow;
  }

  async findAll(): Promise<ScreeningFlow[]> {
    return this.items;
  }

  async create(screeningFlow: ScreeningFlow): Promise<void> {
    this.items.push(screeningFlow);
  }

  async update(screeningFlow: ScreeningFlow): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === screeningFlow.id.toString()
    );

    this.items[itemIndex] = screeningFlow;
  }

  async delete(screeningFlow: ScreeningFlow): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === screeningFlow.id.toString()
    );

    this.items.splice(itemIndex, 1);
  }
}
