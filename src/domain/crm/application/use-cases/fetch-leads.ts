import { Injectable, Inject } from "@nestjs/common";
import { Either, right } from "@/core/either";
import { Lead } from "../../enterprise/entities/lead";
import { LeadsRepository } from "../repositories/leads-repository";

type FetchLeadsUseCaseResponse = Either<null, { leads: Lead[] }>;

@Injectable()
export class FetchLeadsUseCase {
  constructor(
    @Inject(LeadsRepository)
    private leadsRepository: LeadsRepository
  ) {}

  async execute(): Promise<FetchLeadsUseCaseResponse> {
    const leads = await this.leadsRepository.findAll();
    return right({ leads });
  }
}
