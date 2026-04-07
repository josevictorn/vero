import { Injectable, Inject } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { Lead } from "../../enterprise/entities/lead";
import { LeadsRepository } from "../repositories/leads-repository";
import { LawyersRepository } from "../repositories/lawyers-repository";
import { LawyerNotFoundError } from "./errors/lawyer-not-found-error";
import { LeadNotFoundError } from "./errors/lead-not-found-error";

interface EditLeadUseCaseRequest {
  id: string;
  name: string;
  email: string;
  cellphone: string;
  lawyerId?: string | null;
}

type EditLeadUseCaseResponse = Either<Error, { lead: Lead }>;

@Injectable()
export class EditLeadUseCase {
  constructor(
    @Inject(LeadsRepository)
    private leadsRepository: LeadsRepository,
    @Inject(LawyersRepository)
    private lawyersRepository: LawyersRepository
  ) {}

  async execute({
    id,
    name,
    email,
    cellphone,
    lawyerId,
  }: EditLeadUseCaseRequest): Promise<EditLeadUseCaseResponse> {
    const lead = await this.leadsRepository.findById(id);

    if (!lead) {
      return left(new LeadNotFoundError());
    }

    if (lawyerId) {
      const lawyerExists = await this.lawyersRepository.findById(lawyerId);
      if (!lawyerExists) {
        return left(new LawyerNotFoundError());
      }
    }

    lead.name = name;
    lead.email = email;
    lead.cellphone = cellphone;
    if (lawyerId !== undefined) {
      lead.lawyerId = lawyerId;
    }

    await this.leadsRepository.update(lead);

    return right({ lead });
  }
}
