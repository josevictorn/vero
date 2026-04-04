import { makeAccount } from "test/factories/make-account";
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { InvalidPageError } from "@/core/errors/errors/invalid-page-error";
import { FetchAccountsUseCase } from "./fetch-accounts";

let inMemoryAccountsRepository: InMemoryAccountsRepository;

let sut: FetchAccountsUseCase;

describe("Fetch Accounts Use Case", () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository();

    sut = new FetchAccountsUseCase(inMemoryAccountsRepository);
  });

  it("should be able to fetch accounts", async () => {
    const account1 = makeAccount();
    const account2 = makeAccount();

    inMemoryAccountsRepository.items.push(account1, account2);

    const result = await sut.execute({ page: 1 });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accounts: expect.arrayContaining([
        expect.objectContaining({
          id: account1.id,
          email: account1.email,
          name: account1.name,
          role: account1.role,
        }),
        expect.objectContaining({
          id: account2.id,
          email: account2.email,
          name: account2.name,
          role: account2.role,
        }),
      ]),
      meta: {
        currentPage: 1,
        totalCount: 2,
        perPage: 20,
      },
    });
  });

  it("should not be able to fetch accounts with an invalid page", async () => {
    const result = await sut.execute({ page: 0 });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidPageError);
  });
});
