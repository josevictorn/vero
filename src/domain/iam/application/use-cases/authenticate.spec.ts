import { FakeEncrypter } from "test/cryptography/fake-encrypter.ts";
import { FakeHasher } from "test/cryptography/fake-hasher.ts";
import { makeAccount } from "test/factories/make-account.ts";
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository.ts";
import { AuthenticateUseCase } from "./authenticate.ts";
import { WrongCredentialsError } from "./errors/wrong-credentials-error.ts";

let inMemoryAccountsRepository: InMemoryAccountsRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;

let sut: AuthenticateUseCase;

describe("Authenticate Account Use Case", () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();

    sut = new AuthenticateUseCase(
      inMemoryAccountsRepository,
      fakeHasher,
      fakeEncrypter
    );
  });

  it("should be able to authenticate an account with correct credentials", async () => {
    const admin = makeAccount({
      email: "admin@example.com",
      password: await fakeHasher.hash("123456"),
    });

    inMemoryAccountsRepository.items.push(admin);

    const result = await sut.execute({
      email: "admin@example.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });

  it("should not be able to authenticate an account with incorrect email", async () => {
    const admin = makeAccount({
      email: "admin@example.com",
      password: await fakeHasher.hash("123456"),
    });

    inMemoryAccountsRepository.items.push(admin);

    const result = await sut.execute({
      email: "incorrect@example.com",
      password: "123456",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });

  it("should not be able to authenticate an account with incorrect password", async () => {
    const admin = makeAccount({
      email: "admin@example.com",
      password: await fakeHasher.hash("123456"),
    });

    inMemoryAccountsRepository.items.push(admin);

    const result = await sut.execute({
      email: "admin@example.com",
      password: "wrongpassword",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });
});
