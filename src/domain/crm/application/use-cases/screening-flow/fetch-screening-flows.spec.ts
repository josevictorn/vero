import { InMemoryScreeningFlowsRepository } from "test/repositories/in-memory-screening-flows-repository";
import { FetchScreeningFlowsUseCase } from "./fetch-screening-flows";
import { makeScreeningFlow } from "test/factories/make-screening-flow";

let inMemoryScreeningFlowsRepository: InMemoryScreeningFlowsRepository;
let sut: FetchScreeningFlowsUseCase;

describe("Fetch Screening Flows", () => {
  beforeEach(() => {
    inMemoryScreeningFlowsRepository = new InMemoryScreeningFlowsRepository();
    sut = new FetchScreeningFlowsUseCase(inMemoryScreeningFlowsRepository);
  });

  it("should be able to fetch screening flows", async () => {
    inMemoryScreeningFlowsRepository.items.push(makeScreeningFlow());
    inMemoryScreeningFlowsRepository.items.push(makeScreeningFlow());

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.screeningFlows).toHaveLength(2);
    }
  });
});
