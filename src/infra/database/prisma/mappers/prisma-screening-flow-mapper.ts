import { ScreeningFlow as PrismaScreeningFlow, Prisma } from "generated/prisma/client";
import { UniqueEntityID } from "@/core/entity/unique-entity-id.ts";
import { Question, ScreeningFlow } from "@/domain/crm/enterprise/entities/screening-flow";

export class PrismaScreeningFlowMapper {
  static toDomain(raw: PrismaScreeningFlow): ScreeningFlow {
    return ScreeningFlow.create(
      {
        caseType: raw.caseType,
        questions: raw.questions,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(screeningFlow: ScreeningFlow): Prisma.ScreeningFlowUncheckedCreateInput {
    return {
      id: screeningFlow.id.toString(),
      caseType: screeningFlow.caseType,
      questions: screeningFlow.questions as Prisma.InputJsonValue,
      createdAt: screeningFlow.createdAt,
    };
  }
}
