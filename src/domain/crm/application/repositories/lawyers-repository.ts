import { Lawyer } from "../../enterprise/entities/lawyer";

export abstract class LawyersRepository {
  abstract create(lawyer: Lawyer): Promise<void>;
  abstract findById(id: string): Promise<Lawyer | null>;
  abstract findByUserId(userId: string): Promise<Lawyer | null>;
  abstract findAll(): Promise<Lawyer[]>;
  abstract update(lawyer: Lawyer): Promise<void>;
  abstract delete(lawyer: Lawyer): Promise<void>;
}
