import { Inject, Injectable } from "@nestjs/common";
import type { AccountsRepository } from "@/domain/iam/application/repositories/accounts-repository";
import type { Account } from "@/domain/iam/enterprise/entities/account";
import { PrismaService } from "@/infra/database/prisma/prisma.service.ts";
import { PrismaAccountMapper } from "../mappers/prisma-account-mapper";

@Injectable()
export class PrismaAccountsRepository implements AccountsRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async findByEmail(Email: string) {
    const account = await this.prisma.user.findUnique({
      where: {
        email: Email,
      },
    });

    if (!account) {
      return null;
    }

    return PrismaAccountMapper.toDomain(account);
  }

  async findById(id: string) {
    const account = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!account) {
      return null;
    }

    return PrismaAccountMapper.toDomain(account);
  }

  async create(account: Account): Promise<void> {
    const data = PrismaAccountMapper.toPrisma(account);

    await this.prisma.user.create({
      data,
    });
  }
}
