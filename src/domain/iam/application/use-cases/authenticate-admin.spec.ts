import { FakeEncrypter } from "test/cryptography/fake-encrypter.ts";
import { FakeHasher } from "test/cryptography/fake-hasher.ts";
import { makeAdmin } from "test/factories/make-admin.ts";
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository.ts";
import { AuthenticateAdminUseCase } from "./authenticate-admin.ts";
import { WrongCredentialsError } from "./errors/wrong-credentials-error.ts";

let inMemoryAdminsRepository: InMemoryAdminsRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;

let sut: AuthenticateAdminUseCase;

describe("Authenticate Admin Use Case", () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();

    sut = new AuthenticateAdminUseCase(
      inMemoryAdminsRepository,
      fakeHasher,
      fakeEncrypter
    );
  });

  it("should be able to authenticate an admin with correct credentials", async () => {
    const admin = makeAdmin({
      email: "admin@example.com",
      password: await fakeHasher.hash("123456"),
    });

    inMemoryAdminsRepository.items.push(admin);

    const result = await sut.execute({
      email: "admin@example.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });

  it("should not be able to authenticate an admin with incorrect email", async () => {
    const admin = makeAdmin({
      email: "admin@example.com",
      password: await fakeHasher.hash("123456"),
    });

    inMemoryAdminsRepository.items.push(admin);

    const result = await sut.execute({
      email: "incorrect@example.com",
      password: "123456",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });

  it("should not be able to authenticate an admin with incorrect password", async () => {
    const admin = makeAdmin({
      email: "admin@example.com",
      password: await fakeHasher.hash("123456"),
    });

    inMemoryAdminsRepository.items.push(admin);

    const result = await sut.execute({
      email: "admin@example.com",
      password: "wrongpassword",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });
});
