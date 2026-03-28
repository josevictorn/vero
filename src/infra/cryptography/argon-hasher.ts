import { hash, verify } from "argon2";
import type { HashComparer } from "@/domain/iam/application/cryptography/hash-comparer";
import type { HashGenerator } from "@/domain/iam/application/cryptography/hash-generator";

export class ArgonHasher implements HashGenerator, HashComparer {
  async hash(value: string): Promise<string> {
    return await hash(value);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return await verify(value, hash);
  }
}
