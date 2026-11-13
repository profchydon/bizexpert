import React, { useEffect, useMemo } from "react";

import DrawerRight from "@/components/DrawerRight";
import { Card } from "@/components/ui/card";

import SingleInstance from "./SingleInstance";
import MultipleInstance from "./MultipleInstance";
import { useGetEquipmentResaleValueMutation } from "@/api/baseQueries/offboardingApi/getEquipmentResaleValue";
import PageState from "@/components/PageState";
import formatAmount from "@/utils/formatAmount";
import { IEquipment } from "@/types/equipments";
import { useAppDispatch, useAppSelector } from "@/store";
import useOffboarding from "@/hooks/useOffboarding";
import { Offboard_asset } from "@/types/offboarding";
import {
  deleteOffboardingData,
  updateOffboardingData,
} from "@/store/slices/offboardingSlice";
import { useRouter } from "next/navigation";
import { getPriceRange } from "@/utils/getPriceRange";
import { companyBillingCurrencySymbol } from "@/utils/companyBillingCurrency";
import { useAuthUserDetail } from "@/utils/useAuthUser";

interface Props {
  isOpen: boolean;
  baseRoute: string;
  onClose: () => void;
  onNext?: () => void;
  equipID?: string | null;
  companyId?: string | null;
  equipmentsData?: IEquipment[];
  setSelectedRows?: () => void;
}

const SalesPrice: React.FC<Props> = ({
  isOpen,
  baseRoute,
  onClose,
  onNext,
  equipID,
  companyId,
  equipmentsData,
  setSelectedRows,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const billingSymbol = companyBillingCurrencySymbol(company);

  const [
    getEquipmentResaleValue,
    { isLoading, isError, data: resaleValueData },
  ] = useGetEquipmentResaleValueMutation();

  const resaleValueDB = resaleValueData?.data ?? {};
  const resaleValueLoading =
    isLoading || Object.keys(resaleValueDB).length === 0;

  const offboardingData = useAppSelector(
    (state) => state.persistedReducers.offboarding,
  ) as Offboard_asset | Offboard_asset[];

  const isMultiple =
    Array.isArray(offboardingData) && offboardingData?.length > 0
      ? true
      : false;

  const equipmentDB = equipmentsData?.find((item) => item.id === equipID);
  const equipmentDBMultiple = useMemo(() => {
    return (offboardingData as Offboard_asset[])?.filter(
      (item) => item?.actionType === "Sale" || !item?.actionType,
    );
  }, [offboardingData]);

  const priceRange = useMemo(() => {
    if (isOpen) {
      return getPriceRange(resaleValueDB as any);
    }
    return;
  }, [resaleValueDB]);

  const equipment_ids = useMemo(() => {
    if (isOpen) {
      if (!isMultiple) {
        return extractIds(equipmentDB as any);
      }
      return extractIds(equipmentDBMultiple as any);
    }
    return;
  }, [isOpen, equipmentDB, equipmentDBMultiple]);

  useEffect(() => {
    if (isOpen && (equipment_ids as string[])?.length > 0) {
      getEquipmentResaleValue({
        companyId: companyId as string,
        equipment_ids: equipment_ids as string[],
      });
    }
  }, [equipment_ids]);

  const { transformData } = useOffboarding();

  const handleSubmit = () => {
    const equipmentDB = equipmentsData?.find((item) => item.id === equipID);
    const transform = transformData(equipmentDB as any);

    // Preserve existing offboarding data
    let updatedOffboardingData: Offboard_asset[] = Array.isArray(
      offboardingData,
    )
      ? [...offboardingData]
      : offboardingData
        ? [offboardingData]
        : [];

    let newSelections: Record<string, string | null> = {};
    if (
      (equipment_ids as string[])?.length > 0 &&
      (equipment_ids as string[])?.length < 2 &&
      equipID
    ) {
      // Single selection (equipID is valid in this case)
      // @ts-ignore
      newSelections[equipID] = resaleValueDB?.[
        (equipment_ids as string[])?.[0]
      ] as number;
    } else if (typeof resaleValueDB === "object" && resaleValueDB !== null) {
      // Multiple selections - map employee IDs correctly
      Object.entries(resaleValueDB).forEach(([equipmentId, value]) => {
        // @ts-ignore
        return (newSelections[equipmentId] = value);
      });
    }
    // Update or add new equipment data without overriding existing receivers
    // @ts-ignore
    updatedOffboardingData = updatedOffboardingData.map((item) =>
      newSelections[item.id]
        ? {
            ...item,
            estimatedSalesPrice: newSelections[item.id],
            actionType: "Sale",
          }
        : item,
    );

    // Add any new equipment that isn't in the existing list
    Object.entries(newSelections).forEach(([id, price]) => {
      const exists = updatedOffboardingData.some((item) => item.id === id);
      if (!exists) {
        // @ts-ignore
        updatedOffboardingData.push({
          ...transform,
          id,
          estimatedSalesPrice: price as any,
          actionType: "Sale",
        });
      }
    });

    dispatch(updateOffboardingData(updatedOffboardingData));
    onNext?.();
    onClose();
  };

  const handleCancel = () => {
    if (Array.isArray(offboardingData)) {
      if (equipID) {
        const itemToDelete = offboardingData.find(
          (item) => item.id === equipID,
        );

        if (itemToDelete) {
          const updatedOffboardingData = offboardingData.filter(
            (item) => item.statusFlow !== "Completed",
          );

          // Dispatch each item's id for deletion
          updatedOffboardingData.forEach((item) => {
            dispatch(deleteOffboardingData(item.id));
          });

          // Reset state and navigation
          if (baseRoute) {
            router.push(baseRoute);
          }
          onClose();
          return;
        }
      } else {
        const updatedOffboardingData = offboardingData.filter(
          (item) => item.statusFlow !== "Completed",
        );

        updatedOffboardingData.forEach((item) => {
          dispatch(deleteOffboardingData(item.id));
        });

        setSelectedRows?.();
        if (baseRoute) {
          router.push(baseRoute);
        }
        onClose();
        return;
      }
    } else if (offboardingData?.statusFlow !== "Completed") {
      // Handle single instance case if offboardingData is not an array
      dispatch(deleteOffboardingData(equipID as string));
      if (baseRoute) {
        router.push(baseRoute);
      }
      onClose();
      return;
    }
    if (baseRoute) {
      router.push(baseRoute);
    }
    onClose();
  };

  function extractIds(input: any): string[] {
    if (Array.isArray(input)) {
      return input
        ?.map((item) => item?.id?.toString())
        ?.filter(Boolean) as string[];
    }
    return input?.id ? [input?.id?.toString()] : [];
  }

  return (
    <div>
      <DrawerRight
        isOpen={isOpen}
        onClose={handleCancel}
        onCancel={handleCancel}
        onSave={handleSubmit}
        saveText={"Submit"}
        drawerTitle="Sales price"
        drawerDescription="See the estimated sells price right here"
        data-testid="salesprice-drawerright"
      >
        <PageState
          isLoading={isOpen && resaleValueLoading && !priceRange ? true : false}
          isError={isError}
        >
          <div className="space-y-5 mt-6 px-0">
            <Card className="bg-primary-50 border-primary-300 flex flex-col gap-y-3 rounded-xl w-full text-gray-600 p-4">
              <p className="text-primary-700 font-semibold">{`${billingSymbol}${formatAmount((priceRange?.minimum as any) || "")} - ${billingSymbol}${formatAmount((priceRange?.maximum as any) || "")}`}</p>
              <p className="text-primary-700">
                This is the estimated price for sales
              </p>
            </Card>
            <>
              {!isMultiple ? (
                <SingleInstance
                  equipmentDB={equipmentDB as IEquipment}
                  estimatedPrice={
                    resaleValueDB?.[(equipment_ids as string[])?.[0]]
                      ? `${billingSymbol}${formatAmount(resaleValueDB?.[(equipment_ids as string[])?.[0]] as any)}`
                      : ""
                  }
                />
              ) : (
                <MultipleInstance
                  offboardingData={offboardingData as any}
                  resaleValueDB={resaleValueDB}
                  currency_symbol={billingSymbol || ""}
                />
              )}
            </>
          </div>
        </PageState>
      </DrawerRight>
    </div>
  );
};

export default SalesPrice;
