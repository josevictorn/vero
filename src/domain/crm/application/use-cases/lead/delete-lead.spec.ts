import { InMemoryLeadsRepository } from "test/repositories/in-memory-leads-repository";
import { DeleteLeadUseCase } from "./delete-lead";
import { makeLead } from "test/factories/make-lead";

let inMemoryLeadsRepository: InMemoryLeadsRepository;
let sut: DeleteLeadUseCase;

describe("Delete Lead Use Case", () => {
  beforeEach(() => {
    inMemoryLeadsRepository = new InMemoryLeadsRepository();
    sut = new DeleteLeadUseCase(inMemoryLeadsRepository);
  });

  it("should be able to delete a lead", async () => {
    const newLead = makeLead();
    inMemoryLeadsRepository.items.push(newLead);

    const result = await sut.execute({ id: newLead.id.toString() });

    expect(result.isRight()).toBe(true);
    expect(inMemoryLeadsRepository.items).toHaveLength(0);
  });
});
