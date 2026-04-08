import { makeAccount } from "test/factories/make-account.ts";
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository.ts";
import { AccountNotFoundExistsError } from "./errors/acount-not-found-error.ts";
import { EmailAlreadyInUseError } from "./errors/email-already-in-use-error.ts";
import { UpdateAccountUseCase } from "./update-account.ts";

let inMemoryAccountsRepository: InMemoryAccountsRepository;

let sut: UpdateAccountUseCase;

describe("Update Account Use Case", () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository();

    sut = new UpdateAccountUseCase(inMemoryAccountsRepository);
  });

  it("should be able to update account name", async () => {
    const account = makeAccount({
      name: "Old Name",
    });

    inMemoryAccountsRepository.items.push(account);

    const result = await sut.execute({
      accountId: account.id.toString(),
      name: "New Name",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      account: expect.objectContaining({
        id: account.id,
        name: "New Name",
      }),
    });
  });

  it("should be able to update account email", async () => {
    const account = makeAccount({
      email: "old@email.com",
    });

    inMemoryAccountsRepository.items.push(account);

    const result = await sut.execute({
      accountId: account.id.toString(),
      email: "new@email.com",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      account: expect.objectContaining({
        id: account.id,
        email: "new@email.com",
      }),
    });
  });

  it("should be able to update both name and email", async () => {
    const account = makeAccount({
      name: "Old Name",
      email: "old@email.com",
    });

    inMemoryAccountsRepository.items.push(account);

    const result = await sut.execute({
      accountId: account.id.toString(),
      name: "New Name",
      email: "new@email.com",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      account: expect.objectContaining({
        id: account.id,
        name: "New Name",
        email: "new@email.com",
      }),
    });
  });

  it("should not be able to update account email with email already in use", async () => {
    const account1 = makeAccount({
      email: "email@email.com",
    });

    const account2 = makeAccount({
      email: "emailone@email.com",
    });

    inMemoryAccountsRepository.items.push(account1, account2);

    const result = await sut.execute({
      accountId: account2.id.toString(),
      email: account1.email,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EmailAlreadyInUseError);
  });

  it("should not be able to update a non-existing account", async () => {
    const result = await sut.execute({
      accountId: "invalid-id",
      name: "Test",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AccountNotFoundExistsError);
  });
});
