import { InMemoryWorkspacesRepository } from "test/repositories/in-memory-workspaces-repository";
import { EditWorkspaceUseCase } from "./edit-workspace";
import { makeWorkspace } from "test/factories/make-workspace";

let inMemoryWorkspacesRepository: InMemoryWorkspacesRepository;
let sut: EditWorkspaceUseCase;

describe("Edit Workspace", () => {
  beforeEach(() => {
    inMemoryWorkspacesRepository = new InMemoryWorkspacesRepository();
    sut = new EditWorkspaceUseCase(inMemoryWorkspacesRepository);
  });

  it("should be able to edit the workspace", async () => {
    const newWorkspace = makeWorkspace();
    inMemoryWorkspacesRepository.items.push(newWorkspace);

    const result = await sut.execute({
      name: "Novo Escritório",
      cnpj: "00000000000000",
      email: "novo@abc.com",
      cellphone: "11988888888"
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryWorkspacesRepository.items[0].name).toEqual("Novo Escritório");
  });

  it("should not be able to edit if no workspace exists", async () => {
    const result = await sut.execute({
      name: "Novo Escritório",
      cnpj: "00000000000000",
      email: "novo@abc.com",
      cellphone: "11988888888"
    });

    expect(result.isLeft()).toBe(true);
  });
});
