import { LeadsRepository } from "@/domain/crm/application/repositories/leads-repository";
import { Lead } from "@/domain/crm/enterprise/entities/lead";

export class InMemoryLeadsRepository implements LeadsRepository {
  public items: Lead[] = [];

  async create(lead: Lead): Promise<void> {
    this.items.push(lead);
  }

  async findById(id: string): Promise<Lead | null> {
    const lead = this.items.find((item) => item.id.toString() === id);

    if (!lead) {
      return null;
    }

    return lead;
  }

  async findByLawyerId(lawyerId: string): Promise<Lead[]> {
    const leads = this.items.filter((item) => item.lawyerId === lawyerId);

    return leads;
  }

  async findAll(): Promise<Lead[]> {
    return this.items;
  }

  async update(lead: Lead): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === lead.id.toString()
    );

    this.items[itemIndex] = lead;
  }

  async delete(lead: Lead): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === lead.id.toString()
    );

    this.items.splice(itemIndex, 1);
  }
}
