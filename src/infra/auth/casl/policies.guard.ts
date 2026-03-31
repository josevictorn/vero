import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { UserRole } from "@/domain/iam/enterprise/entities/value-objects/user-role.ts";
import { PrismaService } from "@/infra/database/prisma/prisma.service.ts";
import {
  CaslAbilityFactory,
  type CurrentUser,
} from "./casl-ability.factory.ts";
import {
  CHECK_POLICIES_KEY,
  type PolicyHandler,
} from "./check-policies.decorator.ts";

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    @Inject(Reflector)
    private readonly reflector: Reflector,
    @Inject(CaslAbilityFactory)
    private readonly caslAbilityFactory: CaslAbilityFactory,
    @Inject(PrismaService)
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handlers =
      this.reflector.getAllAndOverride<PolicyHandler[]>(CHECK_POLICIES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    if (handlers.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: CurrentUser }>();

    if (!request.user) {
      throw new ForbiddenException("User not authenticated");
    }

    const user = await this.prisma.user.findFirst({
      where: {
        id: request.user?.sub,
      },
    });

    if (!user) {
      throw new ForbiddenException("User not found");
    }

    const ability = this.caslAbilityFactory.defineAbilityFor({
      sub: user?.id,
      role: user?.role as UserRole,
    });
    const allowed = handlers.every((handler) => handler(ability));

    if (!allowed) {
      throw new ForbiddenException("Insufficient permissions");
    }
    return true;
  }
}
