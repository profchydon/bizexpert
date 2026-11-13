import { Button } from "@/components/base/buttons/button";
import { Select } from "@/components/base/select/select";

const PAGE_SIZES = [10, 25, 50, 100];

function TablePaginationFooter({
  currentPage,
  itemsPerPage,
  onPageChange,
  onPageSizeChange,
  totalPages,
  pageSizeOptions = PAGE_SIZES,
}: {
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  totalItems: number;
  totalPages: number;
  pageSizeOptions?: number[];
}) {
  const pageSizeItems = pageSizeOptions.map((size) => ({
    id: String(size),
    label: `${size} per page`,
  }));

  return (
    <div className="flex items-center justify-between border-t border-secondary px-4 py-3 md:px-6 md:pt-3 md:pb-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-secondary">
          Page {currentPage} of {totalPages || 1}
        </span>
        <div className="w-[140px]">
          <Select
            size="sm"
            selectedKey={String(itemsPerPage)}
            onSelectionChange={(key) => onPageSizeChange(Number(key))}
            items={pageSizeItems}
            aria-label="Items per page"
            data-testid="table-pagination-footer-select"
          >
            {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
          </Select>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          color="secondary"
          isDisabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          data-testid="table-pagination-footer-button"
        >
          Previous
        </Button>
        <Button
          size="sm"
          color="secondary"
          isDisabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          data-testid="table-pagination-footer-button-2"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export { TablePaginationFooter };
