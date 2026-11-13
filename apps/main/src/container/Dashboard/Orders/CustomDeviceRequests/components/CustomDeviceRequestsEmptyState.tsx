interface EmptyStateProps {
  onClear: () => void;
  searchQuery: string;
}

export default function CustomDeviceRequestsEmptyState({
  onClear,
  searchQuery,
}: Readonly<EmptyStateProps>) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h4 className="text-lg font-semibold text-gray-900">
        No custom requests found
      </h4>
      <p className="mt-2 max-w-md text-sm text-gray-600">
        {searchQuery
          ? "Try changing your search or filters."
          : "There are no custom device requests to display."}
      </p>
      <button
        type="button"
        className="mt-4 rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        onClick={onClear}
      >
        Clear filters
      </button>
    </div>
  );
}
