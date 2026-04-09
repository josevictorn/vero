import { InMemoryScreeningFlowsRepository } from "test/repositories/in-memory-screening-flows-repository";
import { EditScreeningFlowUseCase } from "./edit-screening-flow";
import { makeScreeningFlow } from "test/factories/make-screening-flow";

let inMemoryScreeningFlowsRepository: InMemoryScreeningFlowsRepository;
let sut: EditScreeningFlowUseCase;

describe("Edit Screening Flow", () => {
  beforeEach(() => {
    inMemoryScreeningFlowsRepository = new InMemoryScreeningFlowsRepository();
    sut = new EditScreeningFlowUseCase(inMemoryScreeningFlowsRepository);
  });

  it("should be able to edit a screening flow", async () => {
    const newFlow = makeScreeningFlow();

    inMemoryScreeningFlowsRepository.items.push(newFlow);

    const result = await sut.execute({
      id: newFlow.id.toString(),
      caseType: "Civil",
      questions: ["new question"],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryScreeningFlowsRepository.items[0].caseType).toEqual("Civil");
    expect(inMemoryScreeningFlowsRepository.items[0].questions).toEqual(["new question"]);
  });

  it("should not be able to edit a non existing screening flow", async () => {
    const result = await sut.execute({
      id: "non-existing-id",
      caseType: "Civil",
      questions: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(Error);
  });
});
