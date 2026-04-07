import { InMemoryLawyersRepository } from "test/repositories/in-memory-lawyers-repository";
import { FetchLawyersUseCase } from "./fetch-lawyers";
import { makeLawyer } from "test/factories/make-lawyer";

let inMemoryLawyersRepository: InMemoryLawyersRepository;
let sut: FetchLawyersUseCase;

describe("Fetch Lawyers Use Case", () => {
  beforeEach(() => {
    inMemoryLawyersRepository = new InMemoryLawyersRepository();
    sut = new FetchLawyersUseCase(inMemoryLawyersRepository);
  });

  it("should be able to fetch all lawyers", async () => {
    inMemoryLawyersRepository.items.push(makeLawyer());
    inMemoryLawyersRepository.items.push(makeLawyer());

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.lawyers).toHaveLength(2);
    }
  });
});
