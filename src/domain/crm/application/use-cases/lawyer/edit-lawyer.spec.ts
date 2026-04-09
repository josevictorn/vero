import { InMemoryLawyersRepository } from "test/repositories/in-memory-lawyers-repository";
import { EditLawyerUseCase } from "./edit-lawyer";
import { makeLawyer } from "test/factories/make-lawyer";

let inMemoryLawyersRepository: InMemoryLawyersRepository;
let sut: EditLawyerUseCase;

describe("Edit Lawyer Use Case", () => {
  beforeEach(() => {
    inMemoryLawyersRepository = new InMemoryLawyersRepository();
    sut = new EditLawyerUseCase(inMemoryLawyersRepository);
  });

  it("should be able to edit a lawyer", async () => {
    const newLawyer = makeLawyer();
    inMemoryLawyersRepository.items.push(newLawyer);

    const result = await sut.execute({
      id: newLawyer.id.toString(),
      cellphone: "11988888888",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryLawyersRepository.items[0].cellphone).toEqual("11988888888");
  });
});
