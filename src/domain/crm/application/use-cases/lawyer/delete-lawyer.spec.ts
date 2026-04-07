import { InMemoryLawyersRepository } from "test/repositories/in-memory-lawyers-repository";
import { DeleteLawyerUseCase } from "./delete-lawyer";
import { makeLawyer } from "test/factories/make-lawyer";

let inMemoryLawyersRepository: InMemoryLawyersRepository;
let sut: DeleteLawyerUseCase;

describe("Delete Lawyer Use Case", () => {
  beforeEach(() => {
    inMemoryLawyersRepository = new InMemoryLawyersRepository();
    sut = new DeleteLawyerUseCase(inMemoryLawyersRepository);
  });

  it("should be able to delete a lawyer", async () => {
    const newLawyer = makeLawyer();
    inMemoryLawyersRepository.items.push(newLawyer);

    const result = await sut.execute({ id: newLawyer.id.toString() });

    expect(result.isRight()).toBe(true);
    expect(inMemoryLawyersRepository.items).toHaveLength(0);
  });
});
