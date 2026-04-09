import { InMemoryWorkspacesRepository } from "test/repositories/in-memory-workspaces-repository";
import { GetWorkspaceUseCase } from "./get-workspace";
import { makeWorkspace } from "test/factories/make-workspace";

let inMemoryWorkspacesRepository: InMemoryWorkspacesRepository;
let sut: GetWorkspaceUseCase;

describe("Get Workspace", () => {
  beforeEach(() => {
    inMemoryWorkspacesRepository = new InMemoryWorkspacesRepository();
    sut = new GetWorkspaceUseCase(inMemoryWorkspacesRepository);
  });

  it("should be able to get the default workspace", async () => {
    const newWorkspace = makeWorkspace();
    inMemoryWorkspacesRepository.items.push(newWorkspace);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.workspace.name).toEqual(newWorkspace.name);
    }
  });

  it("should not be able to get workspace if missing", async () => {
    const result = await sut.execute();

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(Error);
  });
});
