import type { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "@/infra/app.module.ts";
import { DatabaseModule } from "@/infra/database/database.module";
import { WorkspaceFactory } from "test/factories/make-workspace";
import { AccountFactory } from "test/factories/make-account";

describe("Get Workspace Controller (e2e)", () => {
  let app: INestApplication;
  let workspaceFactory: WorkspaceFactory;
  let accountFactory: AccountFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [WorkspaceFactory, AccountFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    workspaceFactory = moduleRef.get(WorkspaceFactory);
    accountFactory = moduleRef.get(AccountFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[GET] /workspace", async () => {
    const user = await accountFactory.makePrismaAccount();
    const accessToken = jwt.sign({ sub: user.id.toString() });

    const workspace = await workspaceFactory.makePrismaWorkspace();

    const response = await request(app.getHttpServer())
      .get("/workspace")
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.workspace).toMatchObject({
      name: workspace.name,
    });
  });
});
