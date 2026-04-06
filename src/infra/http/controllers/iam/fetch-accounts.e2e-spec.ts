import type { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AccountFactory } from "test/factories/make-account";
import { UserRole } from "@/domain/iam/enterprise/entities/value-objects/user-role";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";

describe("Fetch Accounts Controller (e2e)", () => {
  let app: INestApplication;
  let accountFactory: AccountFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AccountFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    accountFactory = moduleRef.get(AccountFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[GET] /accounts", async () => {
    const account1 = await accountFactory.makePrismaAccount({
      email: "admin@example.com",
      role: UserRole.ADMIN,
    });

    const accessToken = jwt.sign({
      sub: account1.id.toString(),
    });

    const account2 = await accountFactory.makePrismaAccount({
      email: "user@example.com",
      role: UserRole.CLIENT,
    });

    const account3 = await accountFactory.makePrismaAccount({
      email: "moderator@example.com",
      role: UserRole.LAWYER,
    });

    const response = await request(app.getHttpServer())
      .get("/accounts")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        page: 1,
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      results: expect.arrayContaining([
        expect.objectContaining({
          id: account1.id.toString(),
          email: account1.email,
          name: account1.name,
          role: account1.role,
          isActive: account1.isActive,
        }),
        expect.objectContaining({
          id: account2.id.toString(),
          email: account2.email,
          name: account2.name,
          role: account2.role,
          isActive: account2.isActive,
        }),
        expect.objectContaining({
          id: account3.id.toString(),
          email: account3.email,
          name: account3.name,
          role: account3.role,
          isActive: account3.isActive,
        }),
      ]),
      meta: expect.objectContaining({
        currentPage: 1,
        totalCount: 3,
        perPage: 20,
      }),
    });
  });
});
