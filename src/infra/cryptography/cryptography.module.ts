import { Module } from "@nestjs/common";
import { HashComparer } from "@/domain/iam/application/cryptography/hash-comparer.ts";
import { HashGenerator } from "@/domain/iam/application/cryptography/hash-generator.ts";
import { ArgonHasher } from "@/infra/cryptography/argon-hasher.ts";

@Module({
  providers: [
    {
      provide: HashComparer,
      useClass: ArgonHasher,
    },
    {
      provide: HashGenerator,
      useClass: ArgonHasher,
    },
  ],
  exports: [HashComparer, HashGenerator],
})
export class CryptographyModule {}
