import type { HashComparer } from "@/domain/iam/application/cryptography/hash-comparer";
import type { HashGenerator } from "@/domain/iam/application/cryptography/hash-generator";

export class FakeHasher implements HashGenerator, HashComparer {
  hash(plain: string) {
    return Promise.resolve(plain.concat("-hashed"));
  }

  compare(plain: string, hash: string) {
    return Promise.resolve(plain.concat("-hashed") === hash);
  }
}
