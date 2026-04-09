import type { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "@/infra/app.module.ts";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service.ts";
import { AccountFactory } from "test/factories/make-account";
import { LawyerFactory } from "test/factories/make-lawyer";
import { WorkspaceFactory } from "test/factories/make-workspace";

describe("Edit Lawyer Controller (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
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
    prisma = moduleRef.get(PrismaService);
    accountFactory = moduleRef.get(AccountFactory);
    lawyerFactory = moduleRef.get(LawyerFactory);
    workspaceFactory = moduleRef.get(WorkspaceFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[PUT] /lawyers/:id", async () => {
    const admin = await accountFactory.makePrismaAccount();
    const accessToken = jwt.sign({ sub: admin.id.toString() });

    await workspaceFactory.makePrismaWorkspace({ id: "default-workspace" } as any);

    const lawyerUser = await accountFactory.makePrismaAccount();
    const lawyer = await lawyerFactory.makePrismaLawyer({
      userId: lawyerUser.id.toString(),
    });

    const response = await request(app.getHttpServer())
      .put(`/lawyers/${lawyer.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        cellphone: "11900000000",
      });

    expect(response.status).toBe(200);

    const onDatabase = await prisma.lawyer.findUnique({
      where: {
        id: lawyer.id.toString(),
      },
    });

    expect(onDatabase?.cellphone).toBe("11900000000");
  });
});
