import { IEmployees } from "@/types/employees";
import { useEffect, useState } from "react";

const useFilterByEmploymentType = (
  data: IEmployees[] | void,
  employmentType: string,
): IEmployees[] | void => {
  const [filteredData, setFilteredData] = useState<IEmployees[] | void>([]);

  useEffect(() => {
    if (employmentType) {
      const filtered = data?.filter((item) => {
        if (employmentType === "All employees") {
          return item;
        }
        return item.employment_type === employmentType;
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [data, employmentType]);

  return filteredData;
};

export default useFilterByEmploymentType;
