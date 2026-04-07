import { Entity } from "@/core/entity/entity";
import type { UniqueEntityID } from "@/core/entity/unique-entity-id";
import type { Optional } from "@/core/types/optional";

export interface Question {
  question: string;
  [key: string]: unknown;
}

export interface ScreeningFlowProps {
  caseType: string;
  questions: Question[];
  createdAt: Date;
}

export class ScreeningFlow extends Entity<ScreeningFlowProps> {
  static create(
    props: Optional<ScreeningFlowProps, "createdAt">,
    id?: UniqueEntityID
  ) {
    const screeningFlow = new ScreeningFlow(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return screeningFlow;
  }

  get caseType() {
    return this.props.caseType;
  }

  get questions() {
    return this.props.questions;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  set caseType(caseType: string) {
    this.props.caseType = caseType;
  }

  set questions(questions: Question[]) {
    this.props.questions = questions;
  }
}

