import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { UserRole } from "../../enterprise/entities/value-objects/user-role";
import { AccountAlreadyExistsError } from "./errors/account-already-exists-error";
import { RegisterAccountUseCase } from "./register-account";

let inMemoryAccountsRepository: InMemoryAccountsRepository;
let fakeHasher: FakeHasher;

let sut: RegisterAccountUseCase;

describe("Register Account Use Case", () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository();
    fakeHasher = new FakeHasher();

    sut = new RegisterAccountUseCase(inMemoryAccountsRepository, fakeHasher);
  });

  it("should be able to register a new account", async () => {
    const result = await sut.execute({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "password",
      role: UserRole.CLIENT,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      account: expect.objectContaining({
        email: "johndoe@example.com",
        name: "John Doe",
        password: "password-hashed",
        role: UserRole.CLIENT,
      }),
    });
  });

  it("should hash the account password before saving it", async () => {
    const result = await sut.execute({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "123456",
      role: UserRole.CLIENT,
    });

    const hashedPassword = await fakeHasher.hash("123456");

    expect(result.isLeft()).toBe(false);
    expect(inMemoryAccountsRepository.items[0].password).toBe(hashedPassword);
  });

  it("should not be able to register a new account with an email that is already in use", async () => {
    await sut.execute({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "123456",
      role: UserRole.CLIENT,
    });

    const result = await sut.execute({
      email: "johndoe@example.com",
      name: "Jane Doe",
      password: "654321",
      role: UserRole.CLIENT,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AccountAlreadyExistsError);
  });
});
