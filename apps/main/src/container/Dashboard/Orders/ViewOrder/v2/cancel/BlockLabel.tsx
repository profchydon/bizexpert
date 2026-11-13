export function BlockLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-xs font-semibold tracking-wider text-quaternary uppercase">
        {children}
      </span>
      <span className="h-px flex-1 bg-border-secondary" aria-hidden="true" />
    </div>
  );
}
