import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Env } from "@/infra/env/env.ts";

@Injectable()
export class EnvService {
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService<Env, true>
  ) {}

  get<T extends keyof Env>(key: T) {
    return this.configService.get(key, { infer: true });
  }
}
