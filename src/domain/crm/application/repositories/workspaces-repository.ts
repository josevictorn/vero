import { Workspace } from "../../enterprise/entities/workspace";

export abstract class WorkspacesRepository {
  abstract update(workspace: Workspace): Promise<void>;
  abstract findFirst(): Promise<Workspace | null>;
}
