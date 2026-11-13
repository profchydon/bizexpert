import type { ExtendedSpecRow } from "@/components/application/spec-fields/ExtendedSpecsList";
import {
  getPeripheralSubtypeForAssetType,
  getSchemaFor,
  getSchemaIdForAssetType,
  getUniversalSection,
} from "@/lib/spec-schema";
import type { SpecField, SpecValues } from "@/lib/spec-schema";

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const ASSET_ALIASES: Record<string, string> = {
  laptop: "laptop",
  notebook: "laptop",
  monitor: "monitors",
  monitors: "monitors",
  display: "monitors",
  screen: "monitors",
  phone: "phone",
  smartphone: "phone",
  mobile: "phone",
  tablet: "tablet",
  ipad: "tablet",
  keyboard: "keyboard",
  mouse: "mouse",
  headphones: "headphones",
  headphone: "headphones",
  headset: "headphones",
  earpods: "earpods",
  earbuds: "earpods",
  earpod: "earpods",
  webcam: "webcam",
  camera: "webcam",
  charger: "chargers",
  chargers: "chargers",
  cable: "chargers",
  adapter: "chargers",
  other: "other",
  desktop: "other",
  dock: "other",
  docking: "other",
  accessory: "other",
};

export function normalizeAssetType(text: string): string | null {
  const n = norm(text);
  return ASSET_ALIASES[n] ?? ASSET_ALIASES[n.split(" ")[0]] ?? null;
}

function schemaFields(assetType: string | null): SpecField[] {
  const entry = getSchemaFor(getSchemaIdForAssetType(assetType));
  const fields: SpecField[] = [...getUniversalSection().fields];
  if (entry?.sections) for (const s of entry.sections) fields.push(...s.fields);
  if (entry?.subtypeField) {
    const sub = getPeripheralSubtypeForAssetType(assetType);
    const subtype = sub ? entry.subtypes?.find((s) => s.id === sub) : undefined;
    if (subtype) for (const s of subtype.sections) fields.push(...s.fields);
  }
  return fields;
}

function fieldForHeader(
  fields: SpecField[],
  header: string,
): SpecField | undefined {
  const h = norm(header);
  return fields.find(
    (f) =>
      norm(f.id) === h ||
      norm(f.label) === h ||
      norm(f.id).replace(/ /g, "") === h.replace(/ /g, ""),
  );
}

function applyColumn(
  specs: SpecValues,
  extended: ExtendedSpecRow[],
  field: SpecField | undefined,
  header: string,
  raw: string,
  i: number,
) {
  const stash = () => extended.push({ id: `x-${i}`, key: header, value: raw });
  if (!field) return stash();
  if (field.kind === "text" || field.kind === "textarea")
    return void (specs[field.id] = raw);
  if (field.kind === "number") {
    const num = Number(raw.replace(/[^0-9.]/g, ""));
    return Number.isNaN(num) ? stash() : void (specs[field.id] = num);
  }
  const n = norm(raw);
  const opt = field.options?.find(
    (o) => norm(o.id) === n || norm(o.label) === n,
  );
  if (opt)
    return void (specs[field.id] =
      field.kind === "multiSelect" ? [opt.id] : opt.id);
  if (field.allowOther) {
    specs[field.id] = "__other__";
    specs[`${field.id}_other`] = raw;
    return;
  }
  stash();
}

/** Map CSV columns onto an asset type's structured specs; unmatched columns become extended specs. */
export function mapRowColumns(
  assetType: string | null,
  columns: { header: string; value: string }[],
): { specs: SpecValues; extendedSpecs: ExtendedSpecRow[] } {
  const fields = schemaFields(assetType);
  const specs: SpecValues = {};
  const extendedSpecs: ExtendedSpecRow[] = [];
  columns.forEach((c, i) => {
    if (!c.value.trim()) return;
    applyColumn(
      specs,
      extendedSpecs,
      fieldForHeader(fields, c.header),
      c.header,
      c.value.trim(),
      i,
    );
  });
  return { specs, extendedSpecs };
}
