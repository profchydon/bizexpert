import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (value: number) => void;
  className?: string;
  buttonClassName?: string;
  nextLabel?: string;
  prevLabel?: string;
}
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  lastPage,
  onPageChange,
  className,
  buttonClassName,
  nextLabel = "Next",
  prevLabel = "Prev",
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between",
        lastPage === 1 && "hidden",
        className,
      )}
    >
      <div>
        <span className="text-sm font-medium text-gray-700">
          Page {currentPage} of {lastPage}
        </span>
      </div>

      <div>
        <div className="flex gap-x-2">
          <Button
            variant={"outline"}
            className={cn(
              "text-sm font-semibold text-gray-600",
              buttonClassName,
            )}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            data-testid="pagination-button"
          >
            {prevLabel}
          </Button>
          <Button
            variant={"outline"}
            className={cn(
              "text-sm font-semibold text-gray-600",
              buttonClassName,
            )}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === lastPage}
            data-testid="pagination-button-2"
          >
            {nextLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
