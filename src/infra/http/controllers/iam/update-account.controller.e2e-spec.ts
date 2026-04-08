import type { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { AccountFactory } from "test/factories/make-account";
import { AppModule } from "@/infra/app.module.ts";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service.ts";

describe("Change Password Controller (e2e)", () => {
  let app: INestApplication;
  let accountFactory: AccountFactory;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AccountFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    accountFactory = moduleRef.get(AccountFactory);
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[PATCH] /accounts/:id/password", async () => {
    const account = await accountFactory.makePrismaAccount({
      password: "hashed-123456", // depende do seu hasher fake/real
    });

    const accessToken = jwt.sign({
      sub: account.id.toString(),
    });

    const response = await request(app.getHttpServer())
      .patch(`/accounts/${account.id.toString()}/password`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        currentPassword: "123456",
        newPassword: "654321",
      });

    expect(response.status).toBe(200);

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        id: account.id.toString(),
      },
    });

    expect(userOnDatabase).toBeTruthy();
    expect(userOnDatabase?.password).not.toBe("hashed-123456");
  });

  test("[PATCH] /accounts/:id/password (wrong current password)", async () => {
    const account = await accountFactory.makePrismaAccount({
      password: "hashed-123456",
    });

    const accessToken = jwt.sign({
      sub: account.id.toString(),
    });

    const response = await request(app.getHttpServer())
      .patch(`/accounts/${account.id.toString()}/password`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        currentPassword: "wrong-password",
        newPassword: "654321",
      });

    expect(response.status).toBe(400);
  });

  test("[PATCH] /accounts/:id/password (non-existing account)", async () => {
    const account = await accountFactory.makePrismaAccount();

    const accessToken = jwt.sign({
      sub: account.id.toString(),
    });

    const response = await request(app.getHttpServer())
      .patch(`/accounts/invalid-id/password`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        currentPassword: "123456",
        newPassword: "654321",
      });

    expect(response.status).toBe(400);
  });
});
