import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "argon2";
import request from "supertest";
import { AdminFactory } from "test/factories/make-admin";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";

describe("Authenticate Admin Controller (e2e)", () => {
  let app: INestApplication;
  let adminFactory: AdminFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    adminFactory = moduleRef.get(AdminFactory);

    await app.init();
  });

  test("[POST] /accounts/admin/authenticate", async () => {
    await adminFactory.makePrismaAdmin({
      email: "admin@example.com",
      password: await hash("password123"),
    });

    const response = await request(app.getHttpServer())
      .post("/accounts/admin/authenticate")
      .send({
        email: "admin@example.com",
        password: "password123",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
