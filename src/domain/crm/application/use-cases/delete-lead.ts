import { Injectable, Inject } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { LeadsRepository } from "../repositories/leads-repository";
import { LeadNotFoundError } from "./errors/lead-not-found-error";

interface DeleteLeadUseCaseRequest {
  id: string;
}

type DeleteLeadUseCaseResponse = Either<Error, null>;

@Injectable()
export class DeleteLeadUseCase {
  constructor(
    @Inject(LeadsRepository)
    private leadsRepository: LeadsRepository
  ) {}

  async execute({ id }: DeleteLeadUseCaseRequest): Promise<DeleteLeadUseCaseResponse> {
    const lead = await this.leadsRepository.findById(id);

    if (!lead) {
      return left(new LeadNotFoundError());
    }

    await this.leadsRepository.delete(lead);

    return right(null);
  }
}
