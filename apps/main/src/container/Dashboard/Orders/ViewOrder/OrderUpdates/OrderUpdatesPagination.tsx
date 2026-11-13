import React from "react";
import { Button } from "@/components/ui/button";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const OrderUpdatesPagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}) => (
  <div className="flex items-center justify-between border-t border-[#eaecf0] px-6 py-3">
    <span className="text-sm text-[#535862]">
      Page {currentPage} of {totalPages}
    </span>
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1 || isLoading}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        data-testid="orderupdatespagination-button"
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages || isLoading}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        data-testid="orderupdatespagination-button-2"
      >
        Next
      </Button>
    </div>
  </div>
);

export default OrderUpdatesPagination;
