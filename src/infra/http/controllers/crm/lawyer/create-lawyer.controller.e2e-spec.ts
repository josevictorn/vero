import type { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "@/infra/app.module.ts";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service.ts";
import { AccountFactory } from "test/factories/make-account";
import { WorkspaceFactory } from "test/factories/make-workspace";

describe("Create Lawyer Controller (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accountFactory: AccountFactory;
  let workspaceFactory: WorkspaceFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AccountFactory, WorkspaceFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    accountFactory = moduleRef.get(AccountFactory);
    workspaceFactory = moduleRef.get(WorkspaceFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[POST] /lawyers", async () => {
    // Generate auth token
    const admin = await accountFactory.makePrismaAccount();
    const accessToken = jwt.sign({ sub: admin.id.toString() });

    // Ensure the default workspace exists in testing DB
    await workspaceFactory.makePrismaWorkspace({ id: "default-workspace" } as any);

    // Create the lawyer's user account
    const newLawyerUser = await accountFactory.makePrismaAccount();

    const response = await request(app.getHttpServer())
      .post("/lawyers")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        userId: newLawyerUser.id.toString(),
        cellphone: "11988888888",
      });

    expect(response.status).toBe(201);

    const onDatabase = await prisma.lawyer.findUnique({
      where: {
        userId: newLawyerUser.id.toString(),
      },
    });

    expect(onDatabase).toBeTruthy();
    expect(onDatabase?.cellphone).toBe("11988888888");
  });
});
