import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository";
import { AdminAlreadyExistsError } from "./errors/admin-already-exists-error.ts";
import { RegisterAdminUseCase } from "./register-admin.ts";

let inMemoryAdminsRepository: InMemoryAdminsRepository;
let fakeHasher: FakeHasher;

let sut: RegisterAdminUseCase;

describe("Register Admin Use Case", () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository();
    fakeHasher = new FakeHasher();

    sut = new RegisterAdminUseCase(inMemoryAdminsRepository, fakeHasher);
  });

  it("should be able to register a new admin", async () => {
    const result = await sut.execute({
      email: "admin@example.com",
      name: "Admin",
      password: "password",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      admin: expect.objectContaining({
        email: "admin@example.com",
        name: "Admin",
        password: "password-hashed",
      }),
    });
  });

  it("should not be able to register a new admin with an email that is already in use", async () => {
    await sut.execute({
      email: "admin@example.com",
      name: "Admin",
      password: "password",
    });

    const result = await sut.execute({
      email: "admin@example.com",
      name: "Admin",
      password: "password",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AdminAlreadyExistsError);
  });

  it("should hash the admin password before saving it", async () => {
    const result = await sut.execute({
      email: "admin@example.com",
      name: "Admin",
      password: "123456",
    });

    const hashedPassword = await fakeHasher.hash("123456");

    expect(result.isLeft()).toBe(false);
    expect(inMemoryAdminsRepository.items[0].password).toBe(hashedPassword);
  });
});
