import type { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AccountFactory } from "test/factories/make-account";
import { UserRole } from "@/domain/iam/enterprise/entities/value-objects/user-role";
import { AppModule } from "@/infra/app.module.ts";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service.ts";

describe("Register Admin Controller (e2e)", () => {
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

  test("[POST] /accounts/admin", async () => {
    const adminAccount = await accountFactory.makePrismaAccount({
      role: UserRole.ADMIN,
    });

    const accessToken = jwt.sign({
      sub: adminAccount.id.toString(),
    });

    const response = await request(app.getHttpServer())
      .post("/accounts/admin")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
      });

    expect(response.status).toBe(201);

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: "john.doe@example.com",
      },
    });

    expect(userOnDatabase).toBeTruthy();
  });
});
