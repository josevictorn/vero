import { Module } from "@nestjs/common";
import { Encrypter } from "@/domain/iam/application/cryptography/encrypter";
import { HashComparer } from "@/domain/iam/application/cryptography/hash-comparer.ts";
import { HashGenerator } from "@/domain/iam/application/cryptography/hash-generator.ts";
import { ArgonHasher } from "@/infra/cryptography/argon-hasher.ts";
import { JwtEncrypter } from "./jwt-encrypter";

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HashComparer,
      useClass: ArgonHasher,
    },
    {
      provide: HashGenerator,
      useClass: ArgonHasher,
    },
  ],
  exports: [HashComparer, HashGenerator, Encrypter],
})
export class CryptographyModule {}
