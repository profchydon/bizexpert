import { ISubOrder } from "@/types/orders";

export interface OrderNoteEntry {
  id: string;
  author: string;
  body: string;
  dateAdded?: string;
}

export interface OrderNoteGroup {
  id: string;
  label: string;
  notes: OrderNoteEntry[];
}

function deviceLabel(sub: ISubOrder): string {
  const equipment = sub.equipment;
  const name =
    equipment?.title ||
    [equipment?.make, equipment?.model].filter(Boolean).join(" ") ||
    sub.order_number ||
    "Item";
  const extra = equipment?.serial_number || sub.tracking_no;
  return extra ? `${name} · ${extra}` : name;
}

function asRecords(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];
  const trimmed = value.trim();
  if (!trimmed) return [];
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    return Array.isArray(parsed) ? parsed : [{ note: trimmed }];
  } catch {
    return [{ note: trimmed }];
  }
}

function toEntry(
  item: unknown,
  id: string,
  fallbackAuthor = "System",
): OrderNoteEntry | null {
  if (typeof item === "string") {
    const body = item.trim();
    return body ? { id, author: fallbackAuthor, body } : null;
  }
  if (!item || typeof item !== "object") return null;
  const record = item as {
    note?: unknown;
    author?: unknown;
    date_added?: unknown;
    id?: unknown;
  };
  const body = typeof record.note === "string" ? record.note.trim() : "";
  if (!body) return null;
  const author =
    typeof record.author === "string" && record.author.trim()
      ? record.author.trim()
      : fallbackAuthor;
  return {
    id: typeof record.id === "string" && record.id ? record.id : id,
    author,
    body,
    dateAdded:
      typeof record.date_added === "string" ? record.date_added : undefined,
  };
}

function extraNotes(sub: ISubOrder): unknown[] {
  const record = sub as ISubOrder & {
    employee_notes?: unknown;
  };
  const values = [sub.employee_note, record.employee_notes];
  return values.flatMap((value) => {
    const body = typeof value === "string" ? value.trim() : "";
    return body ? [{ note: body, author: "Employee" }] : [];
  });
}

export function collectSubOrderNoteGroups(
  subOrders: ISubOrder[],
): OrderNoteGroup[] {
  return subOrders.flatMap((sub) => {
    const equipmentNotes = (sub.equipment as { notes?: unknown } | undefined)
      ?.notes;
    const raw = [
      ...asRecords(sub.note),
      ...asRecords(equipmentNotes),
      ...extraNotes(sub),
    ];
    const notes = raw.flatMap((item, index) => {
      const entry = toEntry(item, `${sub.id}-${index}`);
      return entry ? [entry] : [];
    });
    if (!notes.length) return [];
    return [{ id: sub.id, label: deviceLabel(sub), notes }];
  });
}
