import { FakeHasher } from "test/cryptography/fake-hasher.ts";
import { makeAccount } from "test/factories/make-account.ts";
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository.ts";

import { ChangePasswordUseCase } from "./change-password.ts";
import { AccountNotFoundExistsError } from "./errors/acount-not-found-error.ts";
import { WrongCredentialsError } from "./errors/wrong-credentials-error.ts";

let inMemoryAccountsRepository: InMemoryAccountsRepository;
let fakeHasher: FakeHasher;

let sut: ChangePasswordUseCase;

describe("Change Password Use Case", () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository();
    fakeHasher = new FakeHasher();

    sut = new ChangePasswordUseCase(
      inMemoryAccountsRepository,
      fakeHasher,
      fakeHasher
    );
  });

  it("should be able to change password", async () => {
    const account = makeAccount({
      password: await fakeHasher.hash("123456"),
    });

    inMemoryAccountsRepository.items.push(account);

    const result = await sut.execute({
      accountId: account.id.toString(),
      currentPassword: "123456",
      newPassword: "654321",
    });

    expect(result.isRight()).toBe(true);
    expect(account.password).toBe(await fakeHasher.hash("654321"));
  });

  it("should not change password with wrong current password", async () => {
    const account = makeAccount({
      password: await fakeHasher.hash("123456"),
    });

    inMemoryAccountsRepository.items.push(account);

    const result = await sut.execute({
      accountId: account.id.toString(),
      currentPassword: "wrong-password",
      newPassword: "654321",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });

  it("should not change password if account does not exist", async () => {
    const result = await sut.execute({
      accountId: "invalid-id",
      currentPassword: "123456",
      newPassword: "654321",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AccountNotFoundExistsError);
  });
});
