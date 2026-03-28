import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EnvModule } from "@/infra/env/env.module.ts";
import { envSchema } from "@/infra/env/env.ts";
import { HttpModule } from "@/infra/http/http.module.ts";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    HttpModule,
    EnvModule,
  ],
})
export class AppModule {}
