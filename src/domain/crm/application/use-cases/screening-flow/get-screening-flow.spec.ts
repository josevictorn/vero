import { InMemoryScreeningFlowsRepository } from "test/repositories/in-memory-screening-flows-repository";
import { GetScreeningFlowUseCase } from "./get-screening-flow";
import { makeScreeningFlow } from "test/factories/make-screening-flow";

let inMemoryScreeningFlowsRepository: InMemoryScreeningFlowsRepository;
let sut: GetScreeningFlowUseCase;

describe("Get Screening Flow", () => {
  beforeEach(() => {
    inMemoryScreeningFlowsRepository = new InMemoryScreeningFlowsRepository();
    sut = new GetScreeningFlowUseCase(inMemoryScreeningFlowsRepository);
  });

  it("should be able to get a screening flow by id", async () => {
    const newFlow = makeScreeningFlow();

    inMemoryScreeningFlowsRepository.items.push(newFlow);

    const result = await sut.execute({
      id: newFlow.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.screeningFlow.id).toBeTruthy();
      expect(result.value.screeningFlow.caseType).toEqual(newFlow.caseType);
    }
  });

  it("should not be able to get a screening flow with wrong id", async () => {
    const result = await sut.execute({
      id: "non-existing-id",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(Error);
  });
});
