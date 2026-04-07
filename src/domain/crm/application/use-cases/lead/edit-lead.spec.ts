import { InMemoryLeadsRepository } from "test/repositories/in-memory-leads-repository";
import { InMemoryLawyersRepository } from "test/repositories/in-memory-lawyers-repository";
import { EditLeadUseCase } from "./edit-lead";
import { makeLead } from "test/factories/make-lead";

let inMemoryLeadsRepository: InMemoryLeadsRepository;
let inMemoryLawyersRepository: InMemoryLawyersRepository;
let sut: EditLeadUseCase;

describe("Edit Lead Use Case", () => {
  beforeEach(() => {
    inMemoryLeadsRepository = new InMemoryLeadsRepository();
    inMemoryLawyersRepository = new InMemoryLawyersRepository();
    sut = new EditLeadUseCase(inMemoryLeadsRepository, inMemoryLawyersRepository);
  });

  it("should be able to edit a lead", async () => {
    const newLead = makeLead();
    inMemoryLeadsRepository.items.push(newLead);

    const result = await sut.execute({
      id: newLead.id.toString(),
      name: "Updated Name",
      email: "updated@example.com",
      cellphone: "22999999999",
      lawyerId: null,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryLeadsRepository.items[0].name).toEqual("Updated Name");
  });
});
