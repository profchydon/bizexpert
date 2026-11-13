import { reduxStore } from "@/store";
import { getCartsApi } from "@/api/baseQueries/cartApi/getCarts";
import { isStorageCartLine } from "@/api/baseQueries/cartApi/cartLineTypes";
import { getCartSessionAuth } from "@/api/baseQueries/cartApi/getCartSessionAuth";

export function omitWorkspaceStorageCartLines(lineId?: string) {
  const { userId, companyId } = getCartSessionAuth();
  if (!userId || !companyId) return;

  reduxStore.dispatch(
    getCartsApi.util.updateQueryData(
      "getCarts",
      { companyId, userId },
      (draft) => {
        draft.data = (draft.data ?? []).filter((line) => {
          if (!isStorageCartLine(line)) return true;
          if (line.company_id !== companyId) return true;
          if (!lineId) return false;
          return line.id !== lineId && line.equipment_id !== lineId;
        });
      },
    ),
  );
}
