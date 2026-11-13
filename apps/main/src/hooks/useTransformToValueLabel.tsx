import { useMemo } from "react";

interface FormattedItem {
  value: string;
  label: string;
}

const useTransformToValueLabel = (data: any[]): FormattedItem[] => {
  const formattedData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data.map((item) => ({
      value: item.id,
      label: item.name,
    }));
  }, [data]);

  return formattedData;
};

export default useTransformToValueLabel;
