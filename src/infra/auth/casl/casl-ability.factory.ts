import {
  AbilityBuilder,
  createMongoAbility,
  type MongoAbility,
} from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { UserRole } from "@/domain/iam/enterprise/entities/value-objects/user-role.ts";
import { Action } from "./actions.ts";
import type { Subject } from "./subjects.ts";

export type AppAbility = MongoAbility<[Action, Subject]>;

export interface CurrentUser {
  role: UserRole;
  sub: string;
}

@Injectable()
export class CaslAbilityFactory {
  defineAbilityFor(user: CurrentUser): AppAbility {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    // biome-ignore lint/style/useDefaultSwitchClause: all cases are explicitly handled
    switch (user.role) {
      case UserRole.ADMIN:
        can(Action.Manage, "all");
        break;
      case UserRole.LAWYER:
        break;
      case UserRole.ASSISTANT:
        break;
      case UserRole.FINANCE:
        break;
      case UserRole.CLIENT:
        break;
    }

    return build();
  }
}
