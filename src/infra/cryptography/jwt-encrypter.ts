import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Encrypter } from "@/domain/iam/application/cryptography/encrypter";

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(
    @Inject(JwtService)
    private readonly jwtService: JwtService
  ) {}

  encrypt(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
