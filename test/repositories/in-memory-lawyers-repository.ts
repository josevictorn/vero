import { LawyersRepository } from "@/domain/crm/application/repositories/lawyers-repository";
import { Lawyer } from "@/domain/crm/enterprise/entities/lawyer";

export class InMemoryLawyersRepository implements LawyersRepository {
  public items: Lawyer[] = [];

  async create(lawyer: Lawyer): Promise<void> {
    this.items.push(lawyer);
  }

  async findById(id: string): Promise<Lawyer | null> {
    const lawyer = this.items.find((item) => item.id.toString() === id);

    if (!lawyer) {
      return null;
    }

    return lawyer;
  }

  async findByUserId(userId: string): Promise<Lawyer | null> {
    const lawyer = this.items.find((item) => item.userId === userId);

    if (!lawyer) {
      return null;
    }

    return lawyer;
  }

  async findAll(): Promise<Lawyer[]> {
    return this.items;
  }

  async update(lawyer: Lawyer): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === lawyer.id.toString()
    );

    this.items[itemIndex] = lawyer;
  }

  async delete(lawyer: Lawyer): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === lawyer.id.toString()
    );

    this.items.splice(itemIndex, 1);
  }
}
