import type { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "@/infra/app.module.ts";
import { DatabaseModule } from "@/infra/database/database.module";
import { AccountFactory } from "test/factories/make-account";
import { LawyerFactory } from "test/factories/make-lawyer";
import { WorkspaceFactory } from "test/factories/make-workspace";

describe("Fetch Lawyers Controller (e2e)", () => {
  let app: INestApplication;
  let accountFactory: AccountFactory;
  let lawyerFactory: LawyerFactory;
  let workspaceFactory: WorkspaceFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AccountFactory, LawyerFactory, WorkspaceFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    accountFactory = moduleRef.get(AccountFactory);
    lawyerFactory = moduleRef.get(LawyerFactory);
    workspaceFactory = moduleRef.get(WorkspaceFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[GET] /lawyers", async () => {
    const admin = await accountFactory.makePrismaAccount();
    const accessToken = jwt.sign({ sub: admin.id.toString() });

    await workspaceFactory.makePrismaWorkspace({ id: "default-workspace" } as any);

    const lawyerUser1 = await accountFactory.makePrismaAccount();
    const lawyerUser2 = await accountFactory.makePrismaAccount();

    await Promise.all([
      lawyerFactory.makePrismaLawyer({ userId: lawyerUser1.id.toString() }),
      lawyerFactory.makePrismaLawyer({ userId: lawyerUser2.id.toString() }),
    ]);

    const response = await request(app.getHttpServer())
      .get("/lawyers")
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.lawyers).toHaveLength(2);
  });
});
