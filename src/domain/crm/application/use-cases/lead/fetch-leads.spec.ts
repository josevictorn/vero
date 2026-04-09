import { InMemoryLeadsRepository } from "test/repositories/in-memory-leads-repository";
import { FetchLeadsUseCase } from "./fetch-leads";
import { makeLead } from "test/factories/make-lead";

let inMemoryLeadsRepository: InMemoryLeadsRepository;
let sut: FetchLeadsUseCase;

describe("Fetch Leads Use Case", () => {
  beforeEach(() => {
    inMemoryLeadsRepository = new InMemoryLeadsRepository();
    sut = new FetchLeadsUseCase(inMemoryLeadsRepository);
  });

  it("should be able to fetch all leads", async () => {
    inMemoryLeadsRepository.items.push(makeLead());
    inMemoryLeadsRepository.items.push(makeLead());

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.leads).toHaveLength(2);
    }
  });
});
