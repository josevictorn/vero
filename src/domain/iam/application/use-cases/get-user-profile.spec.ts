import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { GetUserProfileUseCase } from "./get-user-profile";
import { makeAccount } from "test/factories/make-account";
import { AccountNotFoundExistsError } from "./errors/acount-not-found-error";

let inMemoryAccountsRepository: InMemoryAccountsRepository;

let sut: GetUserProfileUseCase;

describe("Get User Profile Use Case", () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository();

    sut = new GetUserProfileUseCase(inMemoryAccountsRepository);
  });

  it("should be able to get the user profile", async () => {
    const account = makeAccount();

    inMemoryAccountsRepository.items.push(account);

    const result = await sut.execute({ userId: account.id.toString() });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: expect.objectContaining({
        id: account.id,
        email: account.email,
        name: account.name,
        role: account.role,
      }),
    });
  });
  
  it("should not be able to get the user profile with an invalid user id", async () => {
    const account = makeAccount();

    inMemoryAccountsRepository.items.push(account);

    const result = await sut.execute({ userId: "invalid-user-id" });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AccountNotFoundExistsError);
  });
});