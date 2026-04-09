import { Entity } from "@/core/entity/entity";
import type { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface LawyerProps {
  userId: string;
  workspaceId: string;
  cellphone: string;
  createdAt: Date;
}

export class Lawyer extends Entity<LawyerProps> {
  get userId() {
    return this.props.userId;
  }
  get workspaceId() {
    return this.props.workspaceId;
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

  static create(props: Optional<LawyerProps, "createdAt">, id?: UniqueEntityID) {
    const lawyer = new Lawyer(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return lawyer;
  }
}
