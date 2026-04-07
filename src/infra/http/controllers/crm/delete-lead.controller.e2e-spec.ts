import type { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "@/infra/app.module.ts";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service.ts";
import { AccountFactory } from "test/factories/make-account";
import { WorkspaceFactory } from "test/factories/make-workspace";
import { LeadFactory } from "test/factories/make-lead";

describe("Delete Lead Controller (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
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
    prisma = moduleRef.get(PrismaService);
    accountFactory = moduleRef.get(AccountFactory);
    workspaceFactory = moduleRef.get(WorkspaceFactory);
    leadFactory = moduleRef.get(LeadFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[DELETE] /leads/:id", async () => {
    const admin = await accountFactory.makePrismaAccount();
    const accessToken = jwt.sign({ sub: admin.id.toString() });

    await workspaceFactory.makePrismaWorkspace({ id: "default-workspace" } as any);

    const lead = await leadFactory.makePrismaLead();

    const response = await request(app.getHttpServer())
      .delete(`/leads/${lead.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(204);

    const onDatabase = await prisma.lead.findUnique({
      where: {
        id: lead.id.toString(),
      },
    });

    expect(onDatabase).toBeNull();
  });
});
