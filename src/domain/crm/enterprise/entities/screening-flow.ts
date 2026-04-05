import { Entity } from "@/core/entity/entity.ts";
import { UniqueEntityID } from "@/core/entity/unique-entity-id.ts";

export interface ScreeningFlowProps {
  caseType: string;
  questions: any;
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

  set questions(questions: any) {
    this.props.questions = questions;
  }
}

// Helper para tornar o createdAt opcional só na criação
type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;