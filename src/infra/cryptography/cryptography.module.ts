import { Module } from "@nestjs/common";
import { HashComparer } from "@/domain/iam/application/cryptography/hash-comparer";
import { HashGenerator } from "@/domain/iam/application/cryptography/hash-generator";
import { ArgonHasher } from "./argon-hasher";

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
