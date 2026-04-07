import { InMemoryLeadsRepository } from "test/repositories/in-memory-leads-repository";
import { GetLeadUseCase } from "./get-lead";
import { makeLead } from "test/factories/make-lead";

let inMemoryLeadsRepository: InMemoryLeadsRepository;
let sut: GetLeadUseCase;

describe("Get Lead Use Case", () => {
  beforeEach(() => {
    inMemoryLeadsRepository = new InMemoryLeadsRepository();
    sut = new GetLeadUseCase(inMemoryLeadsRepository);
  });

  it("should be able to get a lead by id", async () => {
    const newLead = makeLead();
    inMemoryLeadsRepository.items.push(newLead);

    const result = await sut.execute({ id: newLead.id.toString() });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.lead.id.toString()).toEqual(newLead.id.toString());
    }
  });
});
