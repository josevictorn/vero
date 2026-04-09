import type { WorkspacesRepository } from "@/domain/crm/application/repositories/workspaces-repository";
import type { Workspace } from "@/domain/crm/enterprise/entities/workspace";

export class InMemoryWorkspacesRepository implements WorkspacesRepository {
  public items: Workspace[] = [];

  async findFirst(): Promise<Workspace | null> {
    if (this.items.length === 0) {
      return null;
    }
    return this.items[0];
  }

  async update(workspace: Workspace): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === workspace.id.toString()
    );

    this.items[itemIndex] = workspace;
  }
}
