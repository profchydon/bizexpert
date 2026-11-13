import { IAssetRefreshList } from "@/types/assetRefresh";
import { ICart } from "@/types/cart";
import { IEquipmentsInStorageByCountry } from "@/types/equipments";
import { IRefreshDevice } from "@/types/refreshDevice";
import { IRenewStorage } from "@/types/renewStorage";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface Country {
  id?: string;
  name?: string;
  code?: string;
  eta?: string | null;
}

export interface EquipEmployeeState {
  country?: Country;
  storageToEmployeeItems?: IEquipmentsInStorageByCountry[];
  buyToStorageItems?: ICart[];
  renewStorageItems?: IRenewStorage[];
  selectedEquipment?: IAssetRefreshList | IAssetRefreshList[];
  refreshDeviceItems?: IRefreshDevice[];
}

const initialState: EquipEmployeeState = {
  country: undefined,
  storageToEmployeeItems: [],
  buyToStorageItems: [],
  renewStorageItems: undefined,
  selectedEquipment: undefined,
  refreshDeviceItems: undefined,
};

export const equipEmployeeSlice = createSlice({
  name: "equipEmployeeSlice",
  initialState,
  reducers: {
    setCountry: (state, action: PayloadAction<Country>) => {
      state.country = action.payload;
    },

    setBuyToStorageItems: (
      state,
      action: PayloadAction<ICart[] | undefined>,
    ) => {
      state.buyToStorageItems = action.payload;
    },

    setRenewStorageItems: (
      state,
      action: PayloadAction<IRenewStorage[] | undefined>,
    ) => {
      state.renewStorageItems = action.payload;
    },

    setStorageToEmployeeItems: (
      state,
      action: PayloadAction<IEquipmentsInStorageByCountry[]>,
    ) => {
      state.storageToEmployeeItems = action.payload;
    },
    setSelectedEquipment: (
      state,
      action: PayloadAction<
        IAssetRefreshList | IAssetRefreshList[] | undefined
      >,
    ) => {
      state.selectedEquipment = action.payload;
    },
    addSelectedEquipment: (
      state,
      action: PayloadAction<IAssetRefreshList | IAssetRefreshList[]>,
    ) => {
      const payloadArray = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      const selected = state.selectedEquipment;

      if (Array.isArray(selected)) {
        const newItems = payloadArray.filter(
          (newItem) =>
            !selected.some((existingItem) => existingItem.id === newItem.id),
        );
        state.selectedEquipment = [...selected, ...newItems];
      } else if (selected && typeof selected === "object" && "id" in selected) {
        const newItems = payloadArray.filter(
          (newItem) => newItem.id !== selected.id,
        );
        state.selectedEquipment = [selected, ...newItems];
      } else {
        state.selectedEquipment = payloadArray;
      }
    },
    updateSelectedEquipment: (
      state,
      action: PayloadAction<IAssetRefreshList | IAssetRefreshList[]>,
    ) => {
      const payload = action.payload;

      if (Array.isArray(payload)) {
        if (Array.isArray(state.selectedEquipment)) {
          state.selectedEquipment = state.selectedEquipment.map((asset) => {
            const updated = payload.find((item) => item.id === asset.id);
            return updated || asset;
          });
        } else {
          state.selectedEquipment = payload;
        }
      } else if (
        state.selectedEquipment &&
        !Array.isArray(state.selectedEquipment) &&
        state.selectedEquipment.id === payload.id
      ) {
        state.selectedEquipment = {
          ...state.selectedEquipment,
          ...payload,
        };
      }
    },
    removeSelectedEquipment: (state, action: PayloadAction<string>) => {
      if (Array.isArray(state.selectedEquipment)) {
        state.selectedEquipment = state.selectedEquipment.filter(
          (item) =>
            typeof item === "object" &&
            item !== null &&
            "id" in item &&
            item.id !== action.payload,
        );
      } else {
        state.selectedEquipment = undefined;
      }
    },
    removeItemFromSelectedEquipmentById: (
      state,
      action: PayloadAction<{ equipmentId: string; itemId: string }>,
    ) => {
      const { equipmentId, itemId } = action.payload;

      const updateItems = (equipment: IAssetRefreshList) => {
        if (equipment.id !== equipmentId || !equipment.items) return equipment;

        if (Array.isArray(equipment.items)) {
          return {
            ...equipment,
            items: equipment.items.filter((item) => {
              const maybeAssetItem = item as unknown as {
                asset?: { id?: string };
              };
              return maybeAssetItem?.asset?.id !== itemId;
            }),
          };
        }

        const singleItem = equipment.items as unknown as {
          asset?: { id?: string };
        };

        if (singleItem?.asset?.id === itemId) {
          return {
            ...equipment,
            items: undefined,
          };
        }

        return equipment;
      };

      if (Array.isArray(state.selectedEquipment)) {
        state.selectedEquipment = state.selectedEquipment.map(updateItems);
      } else if (
        state.selectedEquipment &&
        typeof state.selectedEquipment === "object"
      ) {
        state.selectedEquipment = updateItems(state.selectedEquipment);
      }
    },
    setRefreshDeviceItems: (state, action: PayloadAction<IRefreshDevice[]>) => {
      state.refreshDeviceItems = action.payload;
    },

    addRefreshDeviceItems: (
      state,
      action: PayloadAction<IRefreshDevice | IRefreshDevice[]>,
    ) => {
      const payloadArray = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      const existingIds = new Set(
        state.refreshDeviceItems?.map((item) => item?.id),
      );

      const newItems = payloadArray.filter(
        (item) => !existingIds?.has(item.id),
      );

      state.refreshDeviceItems = [
        ...(state.refreshDeviceItems || []),
        ...newItems,
      ];
    },

    removeStorageToEmployeeItem: (state, action: PayloadAction<string>) => {
      state.storageToEmployeeItems = state.storageToEmployeeItems?.filter(
        (item) => item.id !== action.payload,
      );
    },
    removeRenewStorageItems: (state, action: PayloadAction<string>) => {
      if (Array.isArray(state.renewStorageItems)) {
        const updated = state.renewStorageItems.filter(
          (asset) => asset?.id !== action.payload,
        );
        state.renewStorageItems = updated.length > 0 ? updated : undefined;
      }
    },

    clearDeviceRefreshFlowState: (state) => {
      state.selectedEquipment = undefined;
      state.refreshDeviceItems = undefined;
    },

    resetEquipEmployeeState: () => {
      return initialState;
    },
  },
});

export const {
  clearDeviceRefreshFlowState,
  resetEquipEmployeeState,
  setCountry,

  setBuyToStorageItems,
  setStorageToEmployeeItems,
  setRenewStorageItems,
  setRefreshDeviceItems,
  setSelectedEquipment,
  addSelectedEquipment,
  updateSelectedEquipment,
  removeSelectedEquipment,
  removeItemFromSelectedEquipmentById,

  removeStorageToEmployeeItem,
  removeRenewStorageItems,
} = equipEmployeeSlice.actions;

export default equipEmployeeSlice.reducer;
