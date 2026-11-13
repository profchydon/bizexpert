import React from "react";
import { fullBleedBorderTopSectionClass } from "@/components/application/dividers/fullBleedDividerClasses";
import { Button } from "@/components/ui/button";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (updater: (page: number) => number) => void;
}

const OrderInfoTablePagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => (
  <div className={fullBleedBorderTopSectionClass}>
    <div className="flex items-center justify-between px-6 py-3">
      <span className="text-sm text-tertiary">
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange((page) => Math.max(1, page - 1))}
          data-testid="orderinfotablepagination-button"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange((page) => Math.min(totalPages, page + 1))}
          data-testid="orderinfotablepagination-button-2"
        >
          Next
        </Button>
      </div>
    </div>
  </div>
);

export default OrderInfoTablePagination;
