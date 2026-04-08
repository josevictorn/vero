import { Entity } from "@/core/entity/entity";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { StatusEnum } from "./value-objects/status";

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

    set status(status: string) {
        this.props.status = status;
    }

    set chatState(chatState: ChatState[]) {
        this.props.chatState = chatState;
    }

    set name(name: string) {
        this.props.name = name;
    }

    set cellphone(cellphone: string) {
        this.props.cellphone = cellphone;
    }

    set isThirdParty(isThirdParty: boolean) {
        this.props.isThirdParty = isThirdParty;
    }

    static create(props: Optional<AISessionProps, "createdAt" | "chatState" | "screeningFlowId" | "isThirdParty" | "status">, id?: UniqueEntityID) {
        const aiSession = new AISession(
            {
                ...props,
                chatState: props.chatState ?? [],
                screeningFlowId: props.screeningFlowId ?? "",
                isThirdParty: props.isThirdParty ?? false,
                createdAt: props.createdAt ?? new Date(),
                status: props.status ?? StatusEnum.IDENTIFYING,
            },
            id
        );

        return aiSession;
    }
}