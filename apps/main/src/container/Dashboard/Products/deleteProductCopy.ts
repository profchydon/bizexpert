export function productDeactivateTitle(): string {
  return "Deactivate product";
}

export function productDeactivateDescription(name: string): string {
  return `This will deactivate ${name} in your catalog. Existing sales and stock history stay in the system.`;
}
