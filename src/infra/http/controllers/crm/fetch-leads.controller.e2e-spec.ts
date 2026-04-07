import type { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "@/infra/app.module.ts";
import { DatabaseModule } from "@/infra/database/database.module";
import { AccountFactory } from "test/factories/make-account";
import { WorkspaceFactory } from "test/factories/make-workspace";
import { LeadFactory } from "test/factories/make-lead";

describe("Fetch Leads Controller (e2e)", () => {
  let app: INestApplication;
  let accountFactory: AccountFactory;
  let workspaceFactory: WorkspaceFactory;
  let leadFactory: LeadFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AccountFactory, WorkspaceFactory, LeadFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    accountFactory = moduleRef.get(AccountFactory);
    workspaceFactory = moduleRef.get(WorkspaceFactory);
    leadFactory = moduleRef.get(LeadFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[GET] /leads", async () => {
    const admin = await accountFactory.makePrismaAccount();
    const accessToken = jwt.sign({ sub: admin.id.toString() });

    await workspaceFactory.makePrismaWorkspace({ id: "default-workspace" } as any);

    await Promise.all([
      leadFactory.makePrismaLead(),
      leadFactory.makePrismaLead(),
    ]);

    const response = await request(app.getHttpServer())
      .get("/leads")
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.leads).toHaveLength(2);
  });
});
