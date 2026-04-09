import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "generated/prisma/client";


const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
});
//deixei hardocodado pelo exemplo
async function main() {
  const defaultWorkspaceId = "4bd6c784-33a8-4af9-b3f2-ac2710475cf8";

  const workspace = await prisma.workspace.upsert({
    where: { id: defaultWorkspaceId },
    update: {},
    create: {
      id: defaultWorkspaceId,
      name: "Escritório Modelo",
      cnpj: "00000000000100",
      email: "contato@escritoriomodelo.com",
      cellphone: "84999999999",
    },
  });

  console.log('Seed executado com sucesso:', { workspace });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });