import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "argon2";
import request from "supertest";
import { AccountFactory } from "test/factories/make-account";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";

describe("Authenticate Controller (e2e)", () => {
  let app: INestApplication;
  let accountFactory: AccountFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AccountFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    accountFactory = moduleRef.get(AccountFactory);

    await app.init();
  });

  test("[POST] /accounts/authenticate", async () => {
    const account = await accountFactory.makePrismaAccount({
      email: "admin@example.com",
      password: await hash("password123"),
    });

    const response = await request(app.getHttpServer())
      .post("/accounts/authenticate")
      .send({
        email: "admin@example.com",
        password: "password123",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      access_token: expect.any(String),
      user: expect.objectContaining({
        id: expect.any(String),
        email: account.email,
        name: account.name,
        role: account.role,
      }),
    });
  });
});
