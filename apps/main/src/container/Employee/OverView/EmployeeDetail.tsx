import { Badge } from "@/components/ui/badge";
import { IEmployees } from "@/types/employees";
import {
  resolveCountryCode,
  resolveCountryText,
} from "@/utils/resolveCountryText";
import React from "react";
import ReactCountryFlag from "react-country-flag";

const EmployeeDetail: React.FC<{ employee?: IEmployees }> = ({ employee }) => {
  const countryName = resolveCountryText(employee?.country);
  const countryCode = resolveCountryCode(
    employee?.country_code,
    employee?.country,
  );

  return (
    <div className="pt-[400px]">
      <div className="grid grid-cols-[auto,auto,auto,auto,auto] bg-gray-50 gap-8 p-6 rounded-xl">
        <div>
          <h4 className="text-gray-500 font-medium text-sm mb-1">Location</h4>
          <p className="text-base font-medium text-gray-700 flex items-center gap-x-1">
            {countryCode ? (
              <ReactCountryFlag
                countryCode={countryCode}
                className=""
                svg
                style={{
                  width: "20px",
                  height: "20px",
                }}
              />
            ) : null}
            {countryName}
          </p>
        </div>

        <div>
          <h4 className="text-gray-500 font-medium text-sm mb-1">Department</h4>
          <p className="text-base font-medium text-gray-700 flex items-center gap-x-1">
            {employee?.departments[0]?.name ?? (
              <Badge variant="red">Not available</Badge>
            )}
          </p>
        </div>

        <div>
          <h4 className="text-gray-500 font-medium text-sm mb-1">Level</h4>
          <p className="text-base font-medium text-gray-700 flex items-center gap-x-1">
            {employee?.level ?? <Badge variant="red">Not available</Badge>}
          </p>
        </div>

        <div>
          <h4 className="text-gray-500 font-medium text-sm mb-1">
            Phone number
          </h4>
          <p className="text-base font-medium text-gray-700 flex items-center gap-x-1">
            {employee?.phone ?? <Badge variant="red">Not available</Badge>}
          </p>
        </div>

        <div>
          <h4 className="text-gray-500 font-medium text-sm mb-1">Address</h4>
          <p className="text-base font-medium text-gray-700 flex items-center gap-x-1">
            {employee?.address}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
