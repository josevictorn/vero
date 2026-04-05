import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Workspace } from "@/domain/crm/enterprise/entities/workspace";
import { WorkspacesRepository } from "@/domain/crm/application/repositories/workspaces-repository";
import { PrismaWorkspaceMapper } from "../mappers/prisma-workspace-mapper";

@Injectable()
export class PrismaWorkspacesRepository implements WorkspacesRepository {
  constructor(private prisma: PrismaService) {}

  async update(workspace: Workspace): Promise<void> {
    const data = PrismaWorkspaceMapper.toPrisma(workspace);

    await this.prisma.workspace.update({
      where: {
        id: workspace.id.toString(),
      },
      data,
    });
  }

  async findFirst(): Promise<Workspace | null> {
    const workspace = await this.prisma.workspace.findFirst();

    if (!workspace) {
      return null;
    }

    return PrismaWorkspaceMapper.toDomain(workspace);
  }
}
