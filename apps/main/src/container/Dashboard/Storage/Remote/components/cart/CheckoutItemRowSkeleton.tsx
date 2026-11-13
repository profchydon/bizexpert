import { StorageCartFeeSkeleton } from "./StorageCartFeeSkeleton";

export function CheckoutItemRowSkeleton() {
  return (
    <li className="flex items-center gap-3 py-3" aria-hidden>
      <span className="size-10 shrink-0 animate-pulse rounded-lg bg-secondary" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <span className="h-4 w-40 max-w-full animate-pulse rounded bg-secondary" />
        <span className="h-3 w-56 max-w-full animate-pulse rounded bg-secondary" />
        <span className="h-5 w-44 max-w-full animate-pulse rounded-md bg-secondary" />
      </div>
      <StorageCartFeeSkeleton size="md" />
      <span className="size-8 shrink-0 animate-pulse rounded bg-secondary" />
    </li>
  );
}
