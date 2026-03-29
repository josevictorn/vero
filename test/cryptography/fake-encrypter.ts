import type { Encrypter } from "@/domain/iam/application/cryptography/encrypter.ts";

export class FakeEncrypter implements Encrypter {
  encrypt(payload: Record<string, unknown>) {
    return Promise.resolve(JSON.stringify(payload));
  }
}
