"use client";

import React from "react";
import { ArrowUpRight, UserCheck } from "lucide-react";

const Support = () => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 lg:p-8">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm">
          <UserCheck className="size-5 text-gray-700" />
        </div>
        <span className="text-sm font-medium text-gray-600">
          Account officer
        </span>
      </div>

      <h2 className="mt-5 text-2xl font-semibold text-gray-900">
        Rayda Operations Team
      </h2>

      <div className="mt-8 flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600">
          Please reach out to your account officer by email if you have any
          issues
        </p>
        <a
          href="mailto:operations@rayda.co"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary-700 hover:underline"
        >
          Email: operations@rayda.co
          <ArrowUpRight className="size-4" />
        </a>
      </div>
    </div>
  );
};

export default Support;
