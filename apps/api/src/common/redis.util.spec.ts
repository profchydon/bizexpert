import { ConfigService } from "@nestjs/config";
import { redisConnectionOptions } from "./redis.util";

function stubConfig(
  values: Record<string, string | number | undefined>,
): ConfigService {
  return {
    get: (key: string, fallback?: string | number) => values[key] ?? fallback,
  } as ConfigService;
}

describe("redisConnectionOptions", () => {
  it("passes username and password with host and port defaults", () => {
    const options = redisConnectionOptions(
      stubConfig({
        REDIS_USERNAME: "bizexpert",
        REDIS_PASSWORD: "bizexpert_dev",
      }),
    );

    expect(options).toEqual({
      host: "localhost",
      port: 6379,
      username: "bizexpert",
      password: "bizexpert_dev",
      tls: undefined,
    });
  });

  it("uses env host, port, and TLS in production", () => {
    const options = redisConnectionOptions(
      stubConfig({
        NODE_ENV: "production",
        REDIS_HOST: "redis.internal",
        REDIS_PORT: 6380,
        REDIS_USERNAME: "app",
        REDIS_PASSWORD: "secret",
      }),
    );

    expect(options.host).toBe("redis.internal");
    expect(options.port).toBe(6380);
    expect(options.username).toBe("app");
    expect(options.password).toBe("secret");
    expect(options.tls).toEqual({});
  });
});
