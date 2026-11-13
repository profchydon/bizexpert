import { useMemo } from "react";

interface FormattedItem {
  value: string;
  label: string;
  eta?: string;
  code?: string;
}

const useTransformCountriesWithETA = (data: any[]): FormattedItem[] => {
  const formattedData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data.map((item) => ({
      value: item.id,
      // label: `${item.name} (${item.eta} days)`,
      label: item.name,
      eta: item.eta,
      code: item.code,
    }));
  }, [data]);

  return formattedData;
};

export default useTransformCountriesWithETA;
