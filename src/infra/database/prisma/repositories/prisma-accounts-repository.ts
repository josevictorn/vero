import { Inject, Injectable } from "@nestjs/common";
import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { AccountsRepository } from "@/domain/iam/application/repositories/accounts-repository";
import type { Account } from "@/domain/iam/enterprise/entities/account";
import { PrismaService } from "@/infra/database/prisma/prisma.service.ts";
import { PrismaAccountMapper } from "../mappers/prisma-account-mapper";

@Injectable()
export class PrismaAccountsRepository implements AccountsRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    const account = await this.prisma.user.findUnique({
      where: {
        email,
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

  async findMany(params: PaginationParams) {
    const [accounts, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip: (params.page - 1) * 20,
        take: 20,
      }),
      this.prisma.user.count(),
    ]);

    return {
      items: accounts.map(PrismaAccountMapper.toDomain),
      total,
    };
  }

  async create(account: Account) {
    const data = PrismaAccountMapper.toPrisma(account);

    await this.prisma.user.create({
      data,
    });
  }
}
