import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import routes from "@/routes";

interface Props {
  employeeName: string;
}

const OffboardDevicesHeader: React.FC<Props> = ({ employeeName }) => {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-gray-900">
          Off-board {employeeName}
        </h1>
        <p className="text-sm text-gray-600">
          Decide what happens to each assigned device, then schedule retrieval.
        </p>
      </div>
      <div className="mt-5 h-px w-full bg-gray-200" />
      <div className="mt-5 flex items-center gap-3">
        <Link
          href={routes.DASHBOARD}
          className="text-gray-400 transition hover:text-gray-600"
        >
          <Home className="h-5 w-5" />
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-300" />
        <Link
          href={routes.EMPLOYEES}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Employees
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-300" />
        <span className="text-sm font-semibold text-primary-700">
          Off-board
        </span>
      </div>
    </div>
  );
};

export default OffboardDevicesHeader;
