import { Entity } from "@/core/entity/entity";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Optional } from "@prisma/client/runtime/client";

export interface ChatState {
    information: string;
    [key: string]: unknown;
}

export interface AISessionProps {
    screeningFlowId: string;
    chatId: string;
    status: string;
    chatState: ChatState[];
    name: string;
    cellphone: string;
    isThirdParty: boolean;
    createdAt: Date;
}

export class AISession extends Entity<AISessionProps> {
    get screeningFlowId() {
        return this.props.screeningFlowId;
    }

    get chatId() {
        return this.props.chatId;
    }

    get status() {
        return this.props.status;
    }

    get chatState() {
        return this.props.chatState;
    }

    get name() {
        return this.props.name;
    }

    get cellphone() {
        return this.props.cellphone;
    }

    get isThirdParty() {
        return this.props.isThirdParty;
    }

    get createdAt() {
        return this.props.createdAt;
    }

        static create(props: Optional<AISessionProps, "createdAt">, id?: UniqueEntityID) {
        const aiSession = new AISession(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
            },
            id
        );

        return aiSession;
    }
}