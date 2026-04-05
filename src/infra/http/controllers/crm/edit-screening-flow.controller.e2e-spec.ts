import type { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "@/infra/app.module.ts";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service.ts";
import { ScreeningFlowFactory } from "test/factories/make-screening-flow";
import { AccountFactory } from "test/factories/make-account";

describe("Edit Screening Flow Controller (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let screeningFlowFactory: ScreeningFlowFactory;
  let accountFactory: AccountFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ScreeningFlowFactory, AccountFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    screeningFlowFactory = moduleRef.get(ScreeningFlowFactory);
    accountFactory = moduleRef.get(AccountFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[PUT] /screening-flows/:id", async () => {
    const user = await accountFactory.makePrismaAccount();
    const accessToken = jwt.sign({ sub: user.id.toString() });

    const flow = await screeningFlowFactory.makePrismaScreeningFlow();

    const response = await request(app.getHttpServer())
      .put(`/screening-flows/${flow.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        caseType: "Civil Alterado",
        questions: [{ text: "Nova pergunta" }],
      });

    expect(response.status).toBe(200);

    const onDatabase = await prisma.screeningFlow.findUnique({
      where: {
        id: flow.id.toString(),
      },
    });

    expect(onDatabase?.caseType).toBe("Civil Alterado");
  });
});
