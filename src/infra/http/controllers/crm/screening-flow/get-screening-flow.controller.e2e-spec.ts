import type { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "@/infra/app.module.ts";
import { DatabaseModule } from "@/infra/database/database.module";
import { ScreeningFlowFactory } from "test/factories/make-screening-flow";
import { AccountFactory } from "test/factories/make-account";

describe("Get Screening Flow Controller (e2e)", () => {
  let app: INestApplication;
  let screeningFlowFactory: ScreeningFlowFactory;
  let accountFactory: AccountFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ScreeningFlowFactory, AccountFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    screeningFlowFactory = moduleRef.get(ScreeningFlowFactory);
    accountFactory = moduleRef.get(AccountFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[GET] /screening-flows/:id", async () => {
    const user = await accountFactory.makePrismaAccount();
    const accessToken = jwt.sign({ sub: user.id.toString() });

    const flow = await screeningFlowFactory.makePrismaScreeningFlow();

    const response = await request(app.getHttpServer())
      .get(`/screening-flows/${flow.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.screeningFlow).toMatchObject({
      caseType: flow.caseType,
    });
  });
});
