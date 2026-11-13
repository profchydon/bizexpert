import { subsidiariesSeed } from "../data/subsidiariesSeed";
import type { Subsidiary } from "../types";

export function subsidiaryNameFromSeed(id: string): string | undefined {
  return subsidiariesSeed.find((subsidiary) => subsidiary.id === id)?.name;
}

export function resolveSubsidiaryName(
  id: string,
  subsidiaries: Subsidiary[],
): string | undefined {
  return subsidiaries.find((subsidiary) => subsidiary.id === id)?.name;
}
