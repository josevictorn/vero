import { Entity } from "@/core/entity/entity.ts";
import type { UniqueEntityID } from "@/core/entity/unique-entity-id.ts";
import type { Optional } from "@/core/types/opcional";
import type { UserRole } from "./value-objects/user-role";

export interface AccountProps {
  createdAt: string;
  email: string;
  isActive: boolean;
  name: string;
  password: string;
  role: UserRole;
}

export class Account extends Entity<AccountProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get role() {
    return this.props.role;
  }

  get password() {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
  }

  get isActive() {
    return this.props.isActive;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  updatePassword(newPassword: string) {
    this.props.password = newPassword;
  }

  update(data: {
      name?: string
      email?: string
    }) {
      if (data.name) 
          this.props.name = data.name

      if (data.email) 
          this.props.email = data.email
    }

  static create(
    props: Optional<AccountProps, "createdAt">,
    id?: UniqueEntityID
  ) {
    const account = new Account(
      { ...props, createdAt: new Date().toISOString() },
      id
    );

    return account;
  }
}
