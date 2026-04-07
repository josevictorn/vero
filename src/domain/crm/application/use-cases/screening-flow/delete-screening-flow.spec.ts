import { InMemoryScreeningFlowsRepository } from "test/repositories/in-memory-screening-flows-repository";
import { DeleteScreeningFlowUseCase } from "./delete-screening-flow";
import { makeScreeningFlow } from "test/factories/make-screening-flow";

let inMemoryScreeningFlowsRepository: InMemoryScreeningFlowsRepository;
let sut: DeleteScreeningFlowUseCase;

describe("Delete Screening Flow", () => {
  beforeEach(() => {
    inMemoryScreeningFlowsRepository = new InMemoryScreeningFlowsRepository();
    sut = new DeleteScreeningFlowUseCase(inMemoryScreeningFlowsRepository);
  });

  it("should be able to delete a screening flow", async () => {
    const newFlow = makeScreeningFlow();

    inMemoryScreeningFlowsRepository.items.push(newFlow);

    const result = await sut.execute({
      id: newFlow.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryScreeningFlowsRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a non existing screening flow", async () => {
    const result = await sut.execute({
      id: "non-existing-id",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(Error);
  });
});
