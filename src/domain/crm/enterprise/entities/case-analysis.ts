import { Entity } from "@/core/entity/entity";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface CaseAnalysisProps {
    aiSessionId: string;
    leadId: string;
    title: string;
    viabilityLabel: string;
    analysisText: string;
    estimatedComplexity: string;
    mainLegalBase: string;
    createdAt: Date;
}

export class CaseAnalysis extends Entity<CaseAnalysisProps> {
    get aiSessionId() {
        return this.props.aiSessionId;
    }

    get leadId() {
        return this.props.leadId;
    }

    get title() {
        return this.props.title;
    }

    get viabilityLabel() {
        return this.props.viabilityLabel;
    }

    get analysisText() {
        return this.props.analysisText;
    }

    get estimatedComplexity() {
        return this.props.estimatedComplexity;
    }

    get mainLegalBase() {
        return this.props.mainLegalBase;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    set title(title: string) {
        this.props.title = title;
    }

    set viabilityLabel(viabilityLabel: string) {
        this.props.viabilityLabel = viabilityLabel;
    }

    set analysisText(analysisText: string) {
        this.props.analysisText = analysisText;
    }

    set estimatedComplexity(estimatedComplexity: string) {
        this.props.estimatedComplexity = estimatedComplexity;
    }

    set mainLegalBase(mainLegalBase: string) {
        this.props.mainLegalBase = mainLegalBase;
    }

    static create(props: Optional<CaseAnalysisProps, "createdAt">, id?: UniqueEntityID) {
        const caseAnalysis = new CaseAnalysis(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
            },
            id
        );

        return caseAnalysis;
    }
}