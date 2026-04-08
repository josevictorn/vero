import { AiSession as PrismaAISession, Prisma } from "generated/prisma/client";
import { UniqueEntityID } from "@/core/entity/unique-entity-id.ts";
import { AISession, ChatState } from "@/domain/crm/enterprise/entities/ai-session";

export class PrismaAISessionMapper {
    static toDomain(raw: PrismaAISession): AISession {
        return AISession.create(
            {
                chatId: raw.chatId,
                chatState: raw.chatState as unknown as ChatState[],
                status: raw.status,
                name: raw.name,
                cellphone: raw.cellphone,
                screeningFlowId: raw.screeningFlowId,
                isThirdParty: raw.isThirdParty,
            },
            new UniqueEntityID(raw.id)
        );
    }

    static toPrisma(aiSession: AISession): Prisma.AiSessionUncheckedCreateInput {
        return {
            id: aiSession.id.toString(),
            chatId: aiSession.chatId,
            chatState: aiSession.chatState as Prisma.InputJsonValue,
            status: aiSession.status,
            name: aiSession.name,
            cellphone: aiSession.cellphone,
            screeningFlowId: aiSession.screeningFlowId,
            isThirdParty: aiSession.isThirdParty,
        };
    }
}
