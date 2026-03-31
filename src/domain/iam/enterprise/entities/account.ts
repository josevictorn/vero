import { Entity } from "@/core/entity/entity.ts";
import type { UniqueEntityID } from "@/core/entity/unique-entity-id.ts";
import type { UserRole } from "./value-objects/user-role";

export interface AccountProps {
  email: string;
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

  static create(props: AccountProps, id?: UniqueEntityID) {
    const account = new Account(props, id);

    return account;
  }
}
