import { Lead } from "../../enterprise/entities/lead";

export abstract class LeadsRepository {
  abstract create(lead: Lead): Promise<void>;
  abstract findById(id: string): Promise<Lead | null>;
  abstract findByLawyerId(lawyerId: string): Promise<Lead[]>;
  abstract findAll(): Promise<Lead[]>;
  abstract update(lead: Lead): Promise<void>;
  abstract delete(lead: Lead): Promise<void>;
}
