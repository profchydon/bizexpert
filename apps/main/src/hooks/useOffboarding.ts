import { Offboard_asset } from "@/types/offboarding";
import { useCallback } from "react";

export const useOffboarding = () => {
  const transformData = useCallback(
    (input: any): Offboard_asset | Offboard_asset[] => {
      if (!input) return [];

      if (Array.isArray(input)) {
        return input?.map(
          ({
            id,
            title,
            year,
            make,
            image_url,
            currency,
            assignee,
            ...rest
          }) => ({
            id,
            title,
            year,
            make,
            image_url,
            currency,
            assignee,
            ...rest,
          }),
        );
      }

      if (typeof input === "object") {
        const {
          id,
          title,
          year,
          make,
          image_url,
          currency,
          assignee,
          ...rest
        } = input;
        return {
          id,
          title,
          year,
          make,
          image_url,
          currency,
          assignee,
          ...rest,
        };
      }

      return [];
    },
    [],
  );

  return { transformData };
};

export default useOffboarding;
