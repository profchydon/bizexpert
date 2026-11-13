export function OfficeMembersLoading() {
  return (
    <div className="flex flex-col gap-3 px-6 py-6" aria-busy>
      {[0, 1, 2].map((row) => (
        <div key={row} className="flex items-center gap-3">
          <div className="size-10 animate-pulse rounded-full bg-gray-100" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-3 w-1/3 animate-pulse rounded bg-gray-100" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
