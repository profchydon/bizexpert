export type SpecInputKind =
  | "select"
  | "multiSelect"
  | "combobox"
  | "number"
  | "text"
  | "textarea";

export interface SpecOption {
  id: string;
  label: string;
}

export type SpecValue = string | string[] | number | null;
export type SpecValues = Record<string, SpecValue>;

export interface SpecField {
  id: string;
  label: string;
  helpText?: string;
  tooltip?: string;
  kind: SpecInputKind;
  options?: SpecOption[];
  allowOther?: boolean;
  placeholder?: string;
  unit?: string;
  numberMin?: number;
  numberMax?: number;
  requiredForVendor?: boolean;
  showIf?: (values: SpecValues) => boolean;
}

export interface SpecSection {
  id: string;
  title: string;
  description?: string;
  fields: SpecField[];
}

export interface SpecSubtypeOption {
  id: string;
  label: string;
}

export interface SpecSubtype {
  id: string;
  label: string;
  sections: SpecSection[];
}

export interface SpecSubtypeField {
  id: string;
  label: string;
  options: SpecSubtypeOption[];
}

export interface SpecSchemaEntry {
  assetTypeId: string;
  label: string;
  sections?: SpecSection[];
  subtypeField?: SpecSubtypeField;
  subtypes?: SpecSubtype[];
}

export const OTHER_VALUE = "__other__";
