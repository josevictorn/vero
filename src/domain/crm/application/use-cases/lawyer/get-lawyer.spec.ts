import { InMemoryLawyersRepository } from "test/repositories/in-memory-lawyers-repository";
import { GetLawyerUseCase } from "./get-lawyer";
import { makeLawyer } from "test/factories/make-lawyer";

let inMemoryLawyersRepository: InMemoryLawyersRepository;
let sut: GetLawyerUseCase;

describe("Get Lawyer Use Case", () => {
  beforeEach(() => {
    inMemoryLawyersRepository = new InMemoryLawyersRepository();
    sut = new GetLawyerUseCase(inMemoryLawyersRepository);
  });

  it("should be able to get a lawyer by id", async () => {
    const newLawyer = makeLawyer();
    inMemoryLawyersRepository.items.push(newLawyer);

    const result = await sut.execute({ id: newLawyer.id.toString() });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.lawyer.id.toString()).toEqual(newLawyer.id.toString());
    }
  });
});
