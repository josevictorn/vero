import type { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "@/infra/app.module.ts";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service.ts";
import { AccountFactory } from "test/factories/make-account";

describe("Create Screening Flow Controller (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accountFactory: AccountFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AccountFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    accountFactory = moduleRef.get(AccountFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[POST] /screening-flows", async () => {
    const user = await accountFactory.makePrismaAccount();
    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .post("/screening-flows")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        caseType: "Trabalhista",
        questions: [{ text: "O funcionário fazia horas extras?", type: "boolean" }],
      });

    expect(response.status).toBe(201);

    const onDatabase = await prisma.screeningFlow.findFirst({
      where: {
        caseType: "Trabalhista",
      },
    });

    expect(onDatabase).toBeTruthy();
  });
});
