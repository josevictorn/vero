import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

describe("Register Admin Controller (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test("[POST] /accounts/admin", async () => {
    const response = await request(app.getHttpServer())
      .post("/accounts/admin")
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
