import { Injectable } from "@nestjs/common";
// biome-ignore lint/style/useImportType: ConfigService must be imported at runtime so NestJS can emit dependency injection metadata (emitDecoratorMetadata); using import type erases the symbol at build time and can cause UnknownDependenciesException.
import { ConfigService } from "@nestjs/config";
import type { Env } from "./env";

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService<Env, true>) {}

  get<T extends keyof Env>(key: T) {
    return this.configService.get(key, { infer: true });
  }
}
