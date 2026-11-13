import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(__dirname, "../../../..");
const compose = readFileSync(join(root, "docker-compose.yml"), "utf8");

describe("docker compose stack", () => {
  it("defines postgres redis api and web", () => {
    expect(compose).toMatch(/^\s+postgres:/m);
    expect(compose).toMatch(/^\s+redis:/m);
    expect(compose).toMatch(/^\s+api:/m);
    expect(compose).toMatch(/^\s+web:/m);
  });

  it("publishes the dashboard and api on host ports", () => {
    expect(compose).toContain('"3000:3000"');
    expect(compose).toContain('"3001:3001"');
    expect(compose).toContain('"5440:5432"');
    expect(compose).toContain('"6379:6379"');
  });

  it("points the api at compose postgres and redis", () => {
    expect(compose).toContain(
      "postgresql://bizexpert:bizexpert_dev@postgres:5432/bizexpert",
    );
    expect(compose).toContain("REDIS_HOST: redis");
    expect(compose).toContain("REDIS_USERNAME: bizexpert");
  });

  it("builds api and web from repo dockerfiles", () => {
    const pkg = readFileSync(join(root, "package.json"), "utf8");
    expect(compose).toContain("dockerfile: apps/api/Dockerfile");
    expect(compose).toContain("dockerfile: Dockerfile.compose");
    expect(compose).toContain("environment: GITHUB_TOKEN");
    expect(pkg).toContain("--env-file apps/main/.env");
    expect(existsSync(join(root, "apps/api/Dockerfile"))).toBe(true);
    expect(existsSync(join(root, "apps/main/Dockerfile.compose"))).toBe(true);
  });

  it("migrates and seeds the api then starts nest", () => {
    const dockerfile = readFileSync(join(root, "apps/api/Dockerfile"), "utf8");
    expect(dockerfile).toContain("python3");
    expect(dockerfile).toContain("g++");
    expect(dockerfile).not.toContain("--ignore-scripts");
    expect(dockerfile).toContain("COPY apps/api/prisma ./prisma");
    expect(dockerfile).toContain("prisma migrate deploy");
    expect(dockerfile).toContain("db:seed:js");
    expect(dockerfile).toContain("node dist/main");
  });

  it("builds the dashboard with bizexpert public env", () => {
    const dockerfile = readFileSync(
      join(root, "apps/main/Dockerfile.compose"),
      "utf8",
    );
    expect(compose).toContain("NEXT_PUBLIC_PRODUCT: bizexpert");
    expect(compose).toContain(
      "NEXT_PUBLIC_API_URL: http://localhost:3001/api/v1",
    );
    expect(dockerfile).toContain("ARG NEXT_PUBLIC_PRODUCT=bizexpert");
    expect(dockerfile).toContain("/run/secrets/github_token");
    expect(dockerfile).toContain('CMD ["node", "server.js"]');
  });
});
