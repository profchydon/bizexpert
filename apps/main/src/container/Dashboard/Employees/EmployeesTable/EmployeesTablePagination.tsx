"use client";

import { Button } from "@/components/base/buttons/button";
import { employeesTablePaginationClass } from "./employeesTableClasses";

type Props = {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
};

const EmployeesTablePagination = ({
  currentPage,
  lastPage,
  onPageChange,
}: Props) => {
  if (lastPage <= 1) return null;

  return (
    <div className={employeesTablePaginationClass}>
      <span className="text-sm font-medium text-secondary">
        Page {currentPage} of {lastPage}
      </span>
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          color="secondary"
          isDisabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          data-testid="employeestablepagination-button"
        >
          Previous
        </Button>
        <Button
          size="sm"
          color="secondary"
          isDisabled={currentPage >= lastPage}
          onClick={() => onPageChange(currentPage + 1)}
          data-testid="employeestablepagination-button-2"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default EmployeesTablePagination;
