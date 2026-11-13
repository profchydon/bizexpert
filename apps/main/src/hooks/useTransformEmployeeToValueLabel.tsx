// import { useMemo } from "react";

// interface FormattedItem {
//   value: string;
//   label: string;
// }

// const useTransformEmployeeToValueLabel = (data: any[]): FormattedItem[] => {
//   const formattedData = useMemo(() => {
//     if (!Array.isArray(data)) return [];

//     return data.map((item) => ({
//       value: item.id,
//       label: `${item.first_name} ${item.last_name}`,
//     }));
//   }, [data]);

//   return formattedData;
// };

// export default useTransformEmployeeToValueLabel;

import { useMemo } from "react";

interface FormattedItem {
  value: string;
  label: string;
  icon?: React.ReactNode; // Optional icon property
}

interface Props {
  data: any[];
  icon?: React.ReactNode; // Optional global icon
}

const useTransformEmployeeToValueLabel = ({
  data,
  icon,
}: Props): FormattedItem[] => {
  const formattedData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data.map((item) => {
      const formattedItem: FormattedItem = {
        value: item.id,
        label: `${item.first_name} ${item.last_name}`,
      };

      // Use item.icon if it exists, otherwise use the global icon
      if (item.icon || icon) {
        formattedItem.icon = item.icon || icon;
      }

      return formattedItem;
    });
  }, [data, icon]);

  return formattedData;
};

export default useTransformEmployeeToValueLabel;
