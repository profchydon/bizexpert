import { FeedItem } from "./FeedItem";
import { ActivityFeed } from "./ActivityFeed";
import OrderUpdatesPagination from "./OrderUpdatesPagination";

interface Props {
  items: FeedItem[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  isPageLoading?: boolean;
}

function OrderUpdatesCard({
  items,
  currentPage,
  totalPages,
  onPageChange,
  isPageLoading = false,
}: Readonly<Props>) {
  const showPagination =
    typeof currentPage === "number" &&
    typeof totalPages === "number" &&
    typeof onPageChange === "function" &&
    totalPages > 1;

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-[#eaecf0] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.1),0px_1px_2px_rgba(16,24,40,0.06)]">
      <div className="px-6 pt-5">
        <p className="text-lg font-semibold text-[#181d27]">Order updates</p>
      </div>
      <div className="mt-4 h-px w-full bg-[#eaecf0]" />
      <div className="px-6 py-6">
        <ActivityFeed items={items} />
      </div>
      {showPagination && (
        <OrderUpdatesPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          isLoading={isPageLoading}
        />
      )}
    </div>
  );
}

export { OrderUpdatesCard };
