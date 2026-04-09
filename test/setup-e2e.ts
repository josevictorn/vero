import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { PrismaClient } from "generated/prisma/client";

config({ path: ".env", override: true });
config({ path: ".env.test", override: true });

const connectionString = `${process.env.DATABASE_URL}`;
const schema = new URL(connectionString).searchParams.get("schema") || "public";
const adapter = new PrismaPg({ connectionString }, { schema });

const prisma = new PrismaClient({ adapter });

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please provider a DATABASE_URL environment variable");
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set("schema", schemaId);

  return url.toString();
}

const schemaId = randomUUID();

beforeAll(() => {
  const databaseURL = generateUniqueDatabaseURL(schemaId);

  process.env.DATABASE_URL = databaseURL;

  execSync("npx prisma migrate deploy", { stdio: 'inherit' });
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
