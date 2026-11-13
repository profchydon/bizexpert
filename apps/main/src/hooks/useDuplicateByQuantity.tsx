import { useState, useEffect, useCallback } from "react";

const duplicateByQuantity = (data: any[]) => {
  if (!data || data.length === 0) return [];

  return data.flatMap((item) => Array(item.quantity).fill({ ...item }));
};

const useDuplicateByQuantity = (initialData = []) => {
  const [duplicatedData, setDuplicatedData] = useState([]);

  useEffect(() => {
    // @ts-ignore
    setDuplicatedData(duplicateByQuantity(initialData));
  }, [initialData]);

  const clearDuplicatedData = useCallback(() => {
    setDuplicatedData([]);
  }, []);

  return { duplicatedData, clearDuplicatedData, setDuplicatedData };
};

export default useDuplicateByQuantity;
