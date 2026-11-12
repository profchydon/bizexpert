import { ConfigService } from "@nestjs/config";
import type { RedisOptions } from "ioredis";

export function redisConnectionOptions(config: ConfigService): RedisOptions {
  return {
    host: config.get<string>("REDIS_HOST", "localhost"),
    port: config.get<number>("REDIS_PORT", 6379),
    username: config.get<string>("REDIS_USERNAME"),
    password: config.get<string>("REDIS_PASSWORD"),
    tls: config.get<string>("NODE_ENV") === "production" ? {} : undefined,
  };
}
