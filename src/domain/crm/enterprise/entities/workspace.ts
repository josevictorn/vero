import { Entity } from "@/core/entity/entity";
import type { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface WorkspaceProps {
  name: string;
  cnpj: string;
  email: string;
  cellphone: string;
  createdAt: Date;
}

export class Workspace extends Entity<WorkspaceProps> {
  get name() {
    return this.props.name;
  }
  set name(name: string) {
    this.props.name = name;
  }

  get cnpj() {
    return this.props.cnpj;
  }
  set cnpj(cnpj: string) {
    this.props.cnpj = cnpj;
  }

  get email() {
    return this.props.email;
  }
  set email(email: string) {
    this.props.email = email;
  }

  get cellphone() {
    return this.props.cellphone;
  }
  set cellphone(cellphone: string) {
    this.props.cellphone = cellphone;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(
    props: Optional<WorkspaceProps, "createdAt">,
    id?: UniqueEntityID
  ) {
    const workspace = new Workspace(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return workspace;
  }
}
