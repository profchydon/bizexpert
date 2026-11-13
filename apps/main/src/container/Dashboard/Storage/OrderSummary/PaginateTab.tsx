import { Button } from "@/components/ui/button";
import React, { FC } from "react";

interface Props {
  previous: () => void;
  next: () => void;
  currentPage: number;
  totalPages: number;
}

const PaginateTab: FC<Props> = (props) => {
  const { previous, currentPage, totalPages, next } = props;
  return (
    <div className="py-4 px-6 text-gray-700 flex flex-row items-center justify-between w-full bg-gray-100 rounded-lg">
      <Button
        variant="outline"
        onClick={previous}
        disabled={currentPage === 1}
        data-testid="paginatetab-button"
      >
        Previous
      </Button>
      <span>
        Page {currentPage} of {totalPages || 0}
      </span>
      <Button
        variant="outline"
        onClick={next}
        disabled={currentPage === totalPages}
        data-testid="paginatetab-button-2"
      >
        Next
      </Button>
    </div>
  );
};

export default PaginateTab;
