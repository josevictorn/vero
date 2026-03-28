import {
  Injectable,
  type OnModuleDestroy,
  type OnModuleInit,
} from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "generated/prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const connectionString = `${process.env.DATABASE_URL}`;
    const schema =
      new URL(connectionString).searchParams.get("schema") || "public";

    const adapter = new PrismaPg({ connectionString }, { schema });

    super({
      log: ["error", "warn"],
      adapter,
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
