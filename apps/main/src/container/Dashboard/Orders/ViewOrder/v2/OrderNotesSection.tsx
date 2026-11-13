"use client";

import { format, isValid, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { hasAccess, IUserRole } from "@/utils/hasAccess";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { OrderNoteGroup } from "./orderNotes";

function formatNoteDate(value?: string): string | null {
  if (!value) return null;
  const parsed = parseISO(
    value.includes("T") ? value : value.replace(" ", "T"),
  );
  if (!isValid(parsed)) return null;
  return format(parsed, "MMM d, yyyy · h:mm a");
}

export function OrderNotesSection({
  groups,
  className,
  listClassName,
}: Readonly<{
  groups: OrderNoteGroup[];
  className?: string;
  listClassName?: string;
}>) {
  const { getUserDetails } = useAuthUserDetail();
  const role = getUserDetails()?.role as IUserRole | undefined;
  if (!role || !hasAccess(role, ["Super Administrator", "Administrator"])) {
    return null;
  }
  if (!groups.length) return null;

  return (
    <section
      className={cn(
        "flex flex-col gap-4 border-t border-gray-200 pt-5",
        className,
      )}
    >
      <h4 className="text-sm font-semibold text-gray-900">Notes</h4>
      <div className={cn("flex flex-col gap-4 overflow-y-auto", listClassName)}>
        {groups.map((group) => (
          <div key={group.id} className="flex flex-col gap-2">
            <p className="text-xs font-medium text-gray-500">{group.label}</p>
            {group.notes.map((note) => {
              const when = formatNoteDate(note.dateAdded);
              return (
                <div
                  key={note.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
                >
                  <p className="text-sm text-gray-900">{note.body}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {note.author}
                    {when ? ` · ${when}` : ""}
                  </p>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
