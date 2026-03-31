import { Module } from "@nestjs/common";
import { DatabaseModule } from "@/infra/database/database.module.ts";
import { CaslAbilityFactory } from "./casl-ability.factory.ts";
import { PoliciesGuard } from "./policies.guard.ts";

@Module({
  providers: [CaslAbilityFactory, PoliciesGuard],
  exports: [CaslAbilityFactory, PoliciesGuard],
  imports: [DatabaseModule],
})
export class CaslModule {}
