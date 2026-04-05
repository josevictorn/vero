import { PrismaClient } from "generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  const defaultWorkspaceId = "default-workspace";

  const workspace = await prisma.workspace.upsert({
    where: { id: defaultWorkspaceId },
    update: {}, // Não faz nada se já existir
    create: {
      id: defaultWorkspaceId,
      name: "Escritório Modelo",
      cnpj: "00000000000100",
      email: "contato@escritoriomodelo.com",
      cellphone: "84999999999",
    },
  });

  console.log({ workspace });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
