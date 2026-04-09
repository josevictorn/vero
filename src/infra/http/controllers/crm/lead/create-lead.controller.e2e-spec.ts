import type { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "@/infra/app.module.ts";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service.ts";
import { AccountFactory } from "test/factories/make-account";
import { WorkspaceFactory } from "test/factories/make-workspace";
import { LawyerFactory } from "test/factories/make-lawyer";

describe("Create Lead Controller (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accountFactory: AccountFactory;
  let workspaceFactory: WorkspaceFactory;
  let lawyerFactory: LawyerFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AccountFactory, WorkspaceFactory, LawyerFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    accountFactory = moduleRef.get(AccountFactory);
    workspaceFactory = moduleRef.get(WorkspaceFactory);
    lawyerFactory = moduleRef.get(LawyerFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
    await workspaceFactory.makePrismaWorkspace({ id: "default-workspace" } as any);
  });

  afterAll(async () => {
    await app.close();
  });

  test("[POST] /leads", async () => {
    const admin = await accountFactory.makePrismaAccount();
    const accessToken = jwt.sign({ sub: admin.id.toString() });

    const lawyerUser = await accountFactory.makePrismaAccount();
    const lawyer = await lawyerFactory.makePrismaLawyer({ userId: lawyerUser.id.toString() });

    const response = await request(app.getHttpServer())
      .post("/leads")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        lawyerId: lawyer.id.toString(),
        name: "Carlos",
        cellphone: "11988888888",
        email: "carlos@abc.com",
      });

    expect(response.status).toBe(201);

    const onDatabase = await prisma.lead.findFirst({
      where: {
        email: "carlos@abc.com",
      },
    });

    expect(onDatabase).toBeTruthy();
    expect(onDatabase?.lawyerId).toBe(lawyer.id.toString());
  });

  test("[POST] /leads without lawyer", async () => {
    const admin = await accountFactory.makePrismaAccount();
    const accessToken = jwt.sign({ sub: admin.id.toString() });

    const response = await request(app.getHttpServer())
      .post("/leads")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Maria",
        cellphone: "11999999999",
        email: "maria@abc.com",
      });

    expect(response.status).toBe(201);

    const onDatabase = await prisma.lead.findFirst({
      where: {
        email: "maria@abc.com",
      },
    });

    expect(onDatabase).toBeTruthy();
    expect(onDatabase?.lawyerId).toBeNull();
  });
});
