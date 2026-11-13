import { strict as assert } from "node:assert";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

test("client Sentry boots from instrumentation-client so Turbopack can load it", () => {
  const client = readFileSync("src/instrumentation-client.ts", "utf8");

  const server = readFileSync("sentry.server.config.ts", "utf8");
  const edge = readFileSync("sentry.edge.config.ts", "utf8");
  const instrumentation = readFileSync("src/instrumentation.ts", "utf8");

  assert.match(client, /Sentry\.init\(/);
  assert.match(client, /4507786195697664/);
  assert.match(client, /environment:\s*getSentryEnvironment\(\)/);
  assert.match(server, /environment:\s*getSentryEnvironment\(\)/);
  assert.match(edge, /environment:\s*getSentryEnvironment\(\)/);
  assert.match(client, /onRouterTransitionStart/);
  assert.match(client, /captureRouterTransitionStart/);
  assert.match(instrumentation, /onRequestError/);
  assert.match(instrumentation, /captureRequestError/);
  assert.equal(existsSync("sentry.client.config.ts"), false);
});
