import { Entity } from "@/core/entity/entity";
import type { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface LeadProps {
  workspaceId: string;
  lawyerId?: string | null;
  name: string;
  cellphone: string;
  email: string;
  createdAt: Date;
}

export class Lead extends Entity<LeadProps> {
  get workspaceId() {
    return this.props.workspaceId;
  }

  get lawyerId() {
    return this.props.lawyerId;
  }
  set lawyerId(lawyerId: string | undefined | null) {
    this.props.lawyerId = lawyerId;
  }

  get name() {
    return this.props.name;
  }
  set name(name: string) {
    this.props.name = name;
  }

  get cellphone() {
    return this.props.cellphone;
  }
  set cellphone(cellphone: string) {
    this.props.cellphone = cellphone;
  }

  get email() {
    return this.props.email;
  }
  set email(email: string) {
    this.props.email = email;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(props: Optional<LeadProps, "createdAt">, id?: UniqueEntityID) {
    const lead = new Lead(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return lead;
  }
}
