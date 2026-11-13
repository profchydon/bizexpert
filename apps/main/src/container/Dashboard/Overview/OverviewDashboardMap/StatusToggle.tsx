import CustomTooltip from "@/components/CustomTooltip";
import React from "react";

const StatusToggle = () => {
  return (
    <div className="absolute bottom-4 left-4 z-10 hidden flex-col gap-y-2 md:flex md:bottom-6 md:left-6">
      <span className="font-semibold text-black text-lg">
        Hover to see details
      </span>
      <div className="bg-white rounded-full border border-gray-200 p-2 px-7">
        <div className="flex gap-x-3 items-center">
          <CustomTooltip
            className="w-64"
            content={
              <div>
                <h4 className="font-bold mb-1">Active</h4>
                <p className="font-normal">
                  This location has ongoing activity related to employees,
                  equipment, or storage.
                </p>
              </div>
            }
          >
            <div className="flex items-center gap-x-3">
              <div className="h-2 w-2 bg-primary-300 rounded-full" />
              <span className="font-semibold">Active</span>
            </div>
          </CustomTooltip>
          <CustomTooltip
            className="w-64"
            content={
              <div>
                <h4 className="font-bold mb-1">Inactive</h4>
                <p className="font-normal">
                  This location has no activity related to employees, equipment,
                  or storage.
                </p>
              </div>
            }
          >
            <div className="flex items-center gap-x-3">
              <div className="h-2 w-2 bg-gray-300 rounded-full" />
              <span className="font-semibold">Inactive</span>
            </div>
          </CustomTooltip>
        </div>
      </div>
    </div>
  );
};

export default StatusToggle;
