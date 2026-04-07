import { InMemoryLeadsRepository } from "test/repositories/in-memory-leads-repository";
import { InMemoryLawyersRepository } from "test/repositories/in-memory-lawyers-repository";
import { InMemoryWorkspacesRepository } from "test/repositories/in-memory-workspaces-repository";
import { CreateLeadUseCase } from "./create-lead";
import { makeWorkspace } from "test/factories/make-workspace";
import { makeLawyer } from "test/factories/make-lawyer";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";

let inMemoryLeadsRepository: InMemoryLeadsRepository;
let inMemoryLawyersRepository: InMemoryLawyersRepository;
let inMemoryWorkspacesRepository: InMemoryWorkspacesRepository;
let sut: CreateLeadUseCase;

describe("Create Lead Use Case", () => {
  beforeEach(() => {
    inMemoryLeadsRepository = new InMemoryLeadsRepository();
    inMemoryLawyersRepository = new InMemoryLawyersRepository();
    inMemoryWorkspacesRepository = new InMemoryWorkspacesRepository();
    sut = new CreateLeadUseCase(inMemoryLeadsRepository, inMemoryWorkspacesRepository, inMemoryLawyersRepository);
  });

  it("should be able to create a lead without lawyer", async () => {
    inMemoryWorkspacesRepository.items.push(makeWorkspace({}, new UniqueEntityID("default-workspace") as any));

    const result = await sut.execute({
      name: "John Doe",
      email: "john@example.com",
      cellphone: "11999999999",
      lawyerId: null,
    });

    expect(result.isRight()).toBe(true);
    if(result.isRight()) {
       expect(result.value.lead.name).toEqual("John Doe");
       expect(result.value.lead.workspaceId).toEqual("default-workspace");
       expect(inMemoryLeadsRepository.items).toHaveLength(1);
    }
  });

  it("should be able to create a lead tied to lawyer", async () => {
    inMemoryWorkspacesRepository.items.push(makeWorkspace({}, new UniqueEntityID("default-workspace") as any));
    const lawyer = makeLawyer();
    inMemoryLawyersRepository.items.push(lawyer);

    const result = await sut.execute({
      name: "John Doe",
      email: "john@example.com",
      cellphone: "11999999999",
      lawyerId: lawyer.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    if(result.isRight()) {
       expect(result.value.lead.lawyerId).toEqual(lawyer.id.toString());
    }
  });
});


