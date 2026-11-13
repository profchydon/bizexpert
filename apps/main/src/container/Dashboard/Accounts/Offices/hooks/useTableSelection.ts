"use client";

import { useEffect, useState } from "react";

export function useTableSelection(resetKey: unknown) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSelected(new Set());
  }, [resetKey]);

  function applySelection(pageIds: string[], keys: "all" | Set<string>) {
    setSelected((previous) => {
      const scope = new Set(pageIds);
      const picked =
        keys === "all"
          ? scope
          : new Set([...keys].map(String).filter((id) => scope.has(id)));
      const next = new Set([...previous].filter((id) => !scope.has(id)));
      picked.forEach((id) => next.add(id));
      return next;
    });
  }

  return {
    selected,
    selectedIds: [...selected],
    applySelection,
    clear: () => setSelected(new Set()),
  };
}
