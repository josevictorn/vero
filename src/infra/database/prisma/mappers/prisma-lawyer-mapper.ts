import { Lawyer as PrismaLawyer, Prisma } from "generated/prisma/client";
import { UniqueEntityID } from "@/core/entity/unique-entity-id.ts";
import { Lawyer } from "@/domain/crm/enterprise/entities/lawyer";

export class PrismaLawyerMapper {
  static toDomain(raw: PrismaLawyer): Lawyer {
    return Lawyer.create(
      {
        userId: raw.userId,
        workspaceId: raw.workspaceId,
        cellphone: raw.cellphone,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(lawyer: Lawyer): Prisma.LawyerUncheckedCreateInput {
    return {
      id: lawyer.id.toString(),
      userId: lawyer.userId,
      workspaceId: lawyer.workspaceId,
      cellphone: lawyer.cellphone,
      createdAt: lawyer.createdAt,
    };
  }
}
