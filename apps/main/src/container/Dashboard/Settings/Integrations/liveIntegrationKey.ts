type LiveIntegrationItem = {
  integration?: { service?: string; slug?: string };
  service?: string;
  slug?: string;
};

export function resolveIntegrationService(
  item: LiveIntegrationItem,
): string | undefined {
  return item.integration?.service ?? item.service;
}

export function isFinchIntegration(item: LiveIntegrationItem): boolean {
  return resolveIntegrationService(item) === "finch";
}

export function resolveLiveIntegrationKey(item: LiveIntegrationItem): string {
  const service = resolveIntegrationService(item);
  const integrationSlug = item.integration?.slug ?? item.slug;

  if (service === "finch") {
    return service;
  }

  return `${service}:${integrationSlug}`;
}
