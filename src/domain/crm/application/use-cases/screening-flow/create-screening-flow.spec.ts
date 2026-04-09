import { InMemoryScreeningFlowsRepository } from "test/repositories/in-memory-screening-flows-repository";
import { CreateScreeningFlowUseCase } from "./create-screening-flow";

let inMemoryScreeningFlowsRepository: InMemoryScreeningFlowsRepository;
let sut: CreateScreeningFlowUseCase;

describe("Create Screening Flow", () => {
  beforeEach(() => {
    inMemoryScreeningFlowsRepository = new InMemoryScreeningFlowsRepository();
    sut = new CreateScreeningFlowUseCase(inMemoryScreeningFlowsRepository);
  });

  it("should be able to create a new screening flow", async () => {
    const result = await sut.execute({
      caseType: "Trabalhista",
      questions: [{ question: "Fazia horas extras?" }],
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      screeningFlow: inMemoryScreeningFlowsRepository.items[0],
    });
    expect(inMemoryScreeningFlowsRepository.items[0].caseType).toEqual("Trabalhista");
  });
});
