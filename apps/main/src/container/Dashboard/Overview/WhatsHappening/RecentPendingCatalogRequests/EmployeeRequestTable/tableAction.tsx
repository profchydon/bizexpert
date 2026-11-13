import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { IEmployeeRequest } from "@/types/employees";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import routes from "@/routes";

const EmployeeRequestTableActions: React.FC<{
  item?: IEmployeeRequest;
  onView: () => void;
}> = ({ item, onView }) => {
  return (
    <>
      <div className="flex flex-row gap-2">
        <Button
          className="text-primary-600 font-semibold"
          variant="ghost"
          size="sm"
          onClick={onView}
          data-testid="employeerequesttableaction-button"
        >
          View Request
        </Button>
        <Link
          href={{
            pathname: routes.CATALOGS_EMPLOYEES_REQUEST,
            query: { catalogId: item?.catalog?.id },
          }}
          title="View all request for this catalog"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            className="text-primary-600 font-semibold"
            variant="ghost"
            size="sm"
            data-testid="employeerequesttableaction-button-2"
          >
            <ExternalLink />
          </Button>
        </Link>
      </div>
    </>
  );
};

export default EmployeeRequestTableActions;
