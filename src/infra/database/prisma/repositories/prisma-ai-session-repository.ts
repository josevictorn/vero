import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { AISessionRepository } from "@/domain/crm/application/repositories/ai-session-repository";
import { AISession } from "@/domain/crm/enterprise/entities/ai-session";
import { PrismaAISessionMapper } from "../mappers/prisma-ai-session-mapper";
import { StatusEnum } from "@/domain/crm/enterprise/entities/value-objects/status";

@Injectable()
export class PrismaAISessionRepository implements AISessionRepository {
    constructor(private prisma: PrismaService) {}

    async create(aiSession: AISession): Promise<void> {
        const data = PrismaAISessionMapper.toPrisma(aiSession);

        await this.prisma.aiSession.create({
            data,
        });
    }

    async update(aiSession: AISession): Promise<void> {
        const data = PrismaAISessionMapper.toPrisma(aiSession);

        await this.prisma.aiSession.update({
            where: {
                id: aiSession.id.toString(),
            },
            data,
        });
    }

    async delete(aiSession: AISession): Promise<void> {
        await this.prisma.aiSession.delete({
            where: {
                id: aiSession.id.toString(),
            },
        });
    }

    async findById(id: string): Promise<AISession | null> {
        const aiSession = await this.prisma.aiSession.findUnique({
            where: {
                id,
            },
        });

        if (!aiSession) {
            return null;
        }

        return PrismaAISessionMapper.toDomain(aiSession);
    }

    async findAll(): Promise<AISession[]> {
        const aiSessions = await this.prisma.aiSession.findMany();

        return aiSessions.map(PrismaAISessionMapper.toDomain);
    }

    async findActiveSessionByChatId(chatId: string): Promise<AISession | null> {
        const aiSession = await this.prisma.aiSession.findFirst({
            where: {
                chatId,
                status: { not: StatusEnum.FINALIZED },
            },
        });

        if (!aiSession) {
            return null;
        }

        return PrismaAISessionMapper.toDomain(aiSession);
    }
}