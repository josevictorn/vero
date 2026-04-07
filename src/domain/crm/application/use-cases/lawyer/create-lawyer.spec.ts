import { InMemoryLawyersRepository } from "test/repositories/in-memory-lawyers-repository";
import { InMemoryWorkspacesRepository } from "test/repositories/in-memory-workspaces-repository";
import { CreateLawyerUseCase } from "./create-lawyer";
import { makeWorkspace } from "test/factories/make-workspace";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";

let inMemoryLawyersRepository: InMemoryLawyersRepository;
let inMemoryWorkspacesRepository: InMemoryWorkspacesRepository;
let sut: CreateLawyerUseCase;

describe("Create Lawyer Use Case", () => {
  beforeEach(() => {
    inMemoryLawyersRepository = new InMemoryLawyersRepository();
    inMemoryWorkspacesRepository = new InMemoryWorkspacesRepository();
    sut = new CreateLawyerUseCase(inMemoryLawyersRepository, inMemoryWorkspacesRepository);
  });

  it("should be able to create a lawyer", async () => {
    const workspace = makeWorkspace({}, new UniqueEntityID("default-workspace"));
    inMemoryWorkspacesRepository.items.push(workspace);

    const result = await sut.execute({
      userId: "user-1",
      cellphone: "11999999999",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryLawyersRepository.items[0].workspaceId).toEqual("default-workspace");
  });

  it("should not be able to create a lawyer if workspace missing", async () => {
    const result = await sut.execute({
      userId: "user-1",
      cellphone: "11999999999",
    });

    expect(result.isLeft()).toBe(true);
  });
});
