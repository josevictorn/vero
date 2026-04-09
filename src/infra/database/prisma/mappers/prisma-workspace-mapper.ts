import { Workspace as PrismaWorkspace, Prisma } from "generated/prisma/client";
import { UniqueEntityID } from "@/core/entity/unique-entity-id.ts";
import { Workspace } from "@/domain/crm/enterprise/entities/workspace";

export class PrismaWorkspaceMapper {
  static toDomain(raw: PrismaWorkspace): Workspace {
    return Workspace.create(
      {
        name: raw.name,
        cnpj: raw.cnpj,
        email: raw.email,
        cellphone: raw.cellphone,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(workspace: Workspace): Prisma.WorkspaceUncheckedCreateInput {
    return {
      id: workspace.id.toString(),
      name: workspace.name,
      cnpj: workspace.cnpj,
      email: workspace.email,
      cellphone: workspace.cellphone,
      createdAt: workspace.createdAt,
    };
  }
}
