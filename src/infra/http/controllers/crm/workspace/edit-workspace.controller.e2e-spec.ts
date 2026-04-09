import type { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "@/infra/app.module.ts";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service.ts";
import { WorkspaceFactory } from "test/factories/make-workspace";
import { AccountFactory } from "test/factories/make-account";

describe("Edit Workspace Controller (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let workspaceFactory: WorkspaceFactory;
  let accountFactory: AccountFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [WorkspaceFactory, AccountFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    workspaceFactory = moduleRef.get(WorkspaceFactory);
    accountFactory = moduleRef.get(AccountFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[PUT] /workspace", async () => {
    const user = await accountFactory.makePrismaAccount();
    const accessToken = jwt.sign({ sub: user.id.toString() });

    const workspace = await workspaceFactory.makePrismaWorkspace();

    const response = await request(app.getHttpServer())
      .put("/workspace")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Escritório Atualizado",
        cnpj: "12345678901234",
        email: "contato@novo.com",
        cellphone: "11900000000",
      });

    expect(response.status).toBe(200);

    const onDatabase = await prisma.workspace.findFirst();

    expect(onDatabase?.name).toBe("Escritório Atualizado");
  });
});
