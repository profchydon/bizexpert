"use client";

import { Button } from "@/components/base/buttons/button";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const EmployeeDetailTablePagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: Props) => (
  <div className="flex items-center justify-between border-t border-secondary px-4 py-3 md:px-6 md:pt-3 md:pb-4">
    <span className="text-sm font-medium text-secondary">
      Page {currentPage} of {totalPages}
    </span>
    <div className="flex items-center gap-3">
      <Button
        size="sm"
        color="secondary"
        isDisabled={currentPage <= 1}
        onPress={() => onPageChange(currentPage - 1)}
        data-testid="employeedetailtablepagination-button"
      >
        Previous
      </Button>
      <Button
        size="sm"
        color="secondary"
        isDisabled={currentPage >= totalPages}
        onPress={() => onPageChange(currentPage + 1)}
        data-testid="employeedetailtablepagination-button-2"
      >
        Next
      </Button>
    </div>
  </div>
);

export default EmployeeDetailTablePagination;
