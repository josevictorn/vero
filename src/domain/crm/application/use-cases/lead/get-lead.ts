import { Injectable, Inject } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { Lead } from "../../../enterprise/entities/lead";
import { LeadsRepository } from "../../repositories/leads-repository";
import { LeadNotFoundError } from "../errors/lead-not-found-error";

interface GetLeadUseCaseRequest {
  id: string;
}

type GetLeadUseCaseResponse = Either<Error, { lead: Lead }>;

@Injectable()
export class GetLeadUseCase {
  constructor(
    @Inject(LeadsRepository)
    private leadsRepository: LeadsRepository
  ) {}

  async execute({ id }: GetLeadUseCaseRequest): Promise<GetLeadUseCaseResponse> {
    const lead = await this.leadsRepository.findById(id);

    if (!lead) {
      return left(new LeadNotFoundError());
    }

    return right({ lead });
  }
}
