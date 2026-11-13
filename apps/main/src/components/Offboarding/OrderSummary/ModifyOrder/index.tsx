import React, { useEffect, useMemo, useState } from "react";
import DrawerRight from "@/components/DrawerRight";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { checkbox_gray_300, checkbox_primary_600 } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { Check, UserIcon } from "lucide-react";
import { IEmployees } from "@/types/employees";
import { roundedImage_placeholder } from "@/assets/images";
import { useAppDispatch, useAppSelector } from "@/store";
import { Offboard_asset } from "@/types/offboarding";
import { DatePicker } from "@/components/ui/date-picker";
import {
  deleteOffboardingData,
  updateOffboardingData,
} from "@/store/slices/offboardingSlice";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/utils/getInitials";
import { useGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import useTransformEmployeeToValueLabel from "@/hooks/useTransformEmployeeToValueLabel";
import { SingleSelectValue } from "@/components/ui/autocomplete";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryState } from "nuqs";
import SelectAReceiver from "@/components/AllEquipments/Drawers/SelectAReceiver";
import routes from "@/routes";
import { Badge } from "@/components/ui/badge";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  refetch?: () => void;
  deleteAssigneeWithoutAssets: () => void;
  equipmentData?: Offboard_asset[];
  baseRoute: string;
}

const ModifyOrder: React.FC<Props> = ({
  isOpen,
  onClose,
  deleteAssigneeWithoutAssets,
  equipmentData,
  refetch,
  baseRoute,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const actionType = searchParams.get("action_type");
  const offboardThisEmployee = searchParams.get("offboard-this-employee");
  const getEquipment = equipmentData?.[0];
  const equipmentsDB = useMemo(() => {
    return getEquipment?.assets?.filter((asset) => {
      if (asset?.actionType === actionType) {
        return asset;
      }
    });
  }, [getEquipment]) as Offboard_asset[];

  const dispatch = useAppDispatch();
  const companyId = useWorkspaceCompanyId();
  const [selectDate, setSelectDate] = useState<Date | string>();
  const [offboardEmployee, setOffboardEmployee] = useState(false);
  const [selectedEquipmentValue, setSelectedEquipmentValue] = useState<
    Offboard_asset[]
  >([]);
  const [isSelectReceiverOpen, setIsSelectReceiverOpen] = useState(false);

  const offboardingData = useAppSelector(
    (state) => state.persistedReducers.offboarding,
  ) as Offboard_asset;

  const getUniqueCollectionDates = (items: Offboard_asset[]) => {
    const uniqueDates = new Set();
    items?.forEach((item) => {
      if (item?.collectionDate && typeof item?.collectionDate === "string") {
        const date = item?.collectionDate?.split(" ")[0];
        uniqueDates.add(date);
      }
    });

    return Array.from(uniqueDates);
  };

  const checkCollections = useMemo(() => {
    if (!equipmentsDB || equipmentsDB.length === 0) {
      return [];
    }

    const response = getUniqueCollectionDates(equipmentsDB);
    return response.length > 0
      ? response
      : equipmentsDB.map((item) => item?.collectionDate);
  }, [equipmentsDB]);

  useEffect(() => {
    setSelectedEquipmentValue(equipmentsDB as Offboard_asset[]);
  }, [equipmentsDB]);

  useEffect(() => {
    if (checkCollections.length > 0) {
      setSelectDate(checkCollections[0] as string);
    }
  }, [checkCollections]);

  const {
    data: getEmployees,
    isLoading: employees_isLoading,
    isError: employees_isError,
  } = useGetEmployeesQuery({ companyId: companyId! }, { skip: !companyId });
  const employeeData = useMemo(
    () => (getEmployees?.data?.data as IEmployees[]) || [],
    [getEmployees],
  );

  const employeeDataOptions = useTransformEmployeeToValueLabel({
    data: employeeData,
    icon: <UserIcon />,
  });

  useEffect(() => {
    setOffboardEmployee(getEquipment?.assignee?.offboardEmployee as boolean);
  }, [getEquipment?.assignee?.offboardEmployee]);

  const selectAllEquipments = () => {
    setSelectedEquipmentValue(equipmentsDB as Offboard_asset[]);
  };

  const handleEquipmentSelect = (itemData: Offboard_asset) => {
    const offboardItemsId = selectedEquipmentValue?.map((item) => item?.id);
    if (offboardItemsId?.includes(itemData?.id as string)) {
      const filterItem = selectedEquipmentValue?.filter(
        (item) => item.id !== itemData?.id,
      );
      setSelectedEquipmentValue(filterItem);
    } else {
      setSelectedEquipmentValue((prev) => [...prev, itemData]);
    }
  };

  const handleNext = () => {
    setIsSelectReceiverOpen(true);
  };

  const handleSubmit = (
    selectedEmployeeValue?: string | Record<string, SingleSelectValue | null>,
  ) => {
    let updatedOffboardingData: Offboard_asset[] = Array.isArray(
      offboardingData,
    )
      ? [...offboardingData]
      : offboardingData
        ? [offboardingData]
        : [];

    if (getEquipment?.actionType === "Transfer") {
      let newSelections: Record<string, IEmployees | null> = {};

      if (
        typeof selectedEmployeeValue === "object" &&
        selectedEmployeeValue !== null
      ) {
        newSelections = Object.entries(selectedEmployeeValue).reduce(
          (acc, [equipmentId, value]) => {
            acc[equipmentId] =
              employeeData?.find((emp) => emp?.id === value?.value) || null;
            return acc;
          },
          {} as Record<string, IEmployees | null>,
        );
      }

      // @ts-ignore
      updatedOffboardingData = updatedOffboardingData?.map((item) =>
        newSelections[item?.id]
          ? {
              ...item,
              assignee: {
                ...item?.assignee,
                offboardEmployee: offboardEmployee,
                // offboardEmployee: Boolean(offboardThisEmployee) || offboardEmployee,
              },
              receiver: newSelections[item.id],
            }
          : item,
      );
    }

    const selectedRowIds = equipmentsDB?.map((row) => row.id) || [];

    if (selectedRowIds.length > 0) {
      // @ts-ignore
      updatedOffboardingData = updatedOffboardingData.map(
        (data) =>
          selectedRowIds.includes(data.id)
            ? {
                ...data,
                collectionDate: selectDate,
                assignee: {
                  ...data?.assignee,
                  offboardEmployee: offboardEmployee,
                  // offboardEmployee: Boolean(offboardThisEmployee) || offboardEmployee,
                },
              }
            : data, // Keep other items unchanged
      );
    } else if (!Array.isArray(offboardingData)) {
      updatedOffboardingData = [
        {
          ...offboardingData,
          collectionDate: selectDate,
          assignee: {
            ...offboardingData?.assignee,
            offboardEmployee: Boolean(offboardThisEmployee) || offboardEmployee,
          },
        },
      ] as Offboard_asset[];
    }

    dispatch(updateOffboardingData(updatedOffboardingData));

    // Remove unselected employees
    const removeUnselectedEmployee = getUniqueIds(
      equipmentsDB as Offboard_asset[],
      selectedEquipmentValue,
    );
    removeUnselectedEmployee.forEach((item) =>
      dispatch(deleteOffboardingData(item)),
    );
    setOffboardEmployee(false);
    refetch?.();
    if (getEquipment?.actionType !== "Transfer") {
      onClose();
      router.push(`${baseRoute}/order-summary`);
    }
  };

  const handleClose = () => {
    router.push(`${baseRoute}/order-summary`);
    onClose();
  };

  const handleSubmitInstance = () => {
    if (actionType !== "Transfer") {
      return handleSubmit();
    }
    return handleNext();
  };

  function getUniqueIds(array1: Offboard_asset[], array2: Offboard_asset[]) {
    const ids1 = new Set(array1.map((item) => item.id));
    const ids2 = new Set(array2.map((item) => item.id));

    const uniqueIds = [
      ...array1.filter((item) => !ids2.has(item.id)).map((item) => item.id),
      ...array2.filter((item) => !ids1.has(item.id)).map((item) => item.id),
    ];

    return uniqueIds;
  }

  return (
    <div>
      <DrawerRight
        isOpen={isOpen}
        onCancel={handleClose}
        onClose={handleClose}
        onSave={handleSubmitInstance}
        saveText={actionType !== "Transfer" ? "Submit" : "Continue"}
        drawerTitle="Modify order"
        drawerDescription="Please select all employee’s equipment you want to off board"
        data-testid="modifyorder-drawerright"
      >
        <div className="mb-[78px]">
          <div className="flex flex-col w-full gap-y-4">
            <div className="flex flex-row gap-x-6 items-center">
              <Avatar className="h-[96px] w-[96px] border-2 border-white shadow-md">
                <AvatarFallback className="text-gray-600 text-[44px] font-medium bg-gray-100">
                  {getInitials(`${getEquipment?.assignee?.name || ""}`)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-2xl font-semibold text-gray-900">
                  {getEquipment?.assignee?.name}
                </p>
                <p className="text-base text-gray-600">
                  {getEquipment?.assignee?.email || (
                    <Badge variant="red">Not available</Badge>
                  )}
                </p>
              </div>
            </div>
            {equipmentsDB?.length! > 0 && (
              <div className="mt-6 mb-4">
                <Button
                  className="w-full space-x-2 border border-gray-300"
                  variant={"outline"}
                  onClick={selectAllEquipments}
                  data-testid="modifyorder-button"
                >
                  <Check /> <span>Select all</span>
                </Button>
              </div>
            )}
            {equipmentsDB &&
              equipmentsDB?.map((equipment) => (
                <Card
                  key={equipment.id}
                  className={cn(
                    "bg-white flex flex-col gap-y-3 w-full text-gray-600 cursor-pointer border-gray-200",
                    `${selectedEquipmentValue?.some((item) => item?.id === equipment.id) && "border-primary-600 border-2 bg-primary-50"}`,
                  )}
                  onClick={() => handleEquipmentSelect(equipment!)}
                >
                  <CardContent className="p-4 flex flex-row items-start space-x-2 justify-between">
                    <div className="flex items-center gap-x-3">
                      <Image
                        src={equipment?.image_url || roundedImage_placeholder}
                        alt="data.imageAlt"
                        width={34}
                        height={34}
                      />

                      <div className="space-y-1 flex flex-col">
                        <p className="text-sm font-normal leading-none">
                          <span className="text-sm font-medium">
                            {equipment?.title || ""} {equipment?.make || ""}{" "}
                            {equipment?.year || ""}
                          </span>
                        </p>
                      </div>
                    </div>

                    {!selectedEquipmentValue?.some(
                      (item) => item?.id === equipment?.id,
                    ) ? (
                      <Image src={checkbox_gray_300} alt="check_primary_icon" />
                    ) : (
                      <Image
                        src={checkbox_primary_600}
                        alt="check_primary_icon"
                      />
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <p className="text-sm text-gray-700 font-medium">
              Collection start date
            </p>
            <DatePicker
              className="w-full h-[44px]"
              date={selectDate as Date}
              placeHolder="Select date"
              disablePastDates
              setDate={(value: Date) => {
                if (value !== selectDate) {
                  setSelectDate?.(value);
                }
              }}
            />
          </div>
          {/* <Card className="p-4 mt-6 border-gray-300 flex flex-row items-start justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-gray-700 text-sm font-medium">
                Off-board employee
              </p>
              <p className="text-gray-600 text-sm">
                Archive employee once successfully off-boarded
              </p>
            </div>
            <Switch
              onCheckedChange={(value) => setOffboardEmployee(value)}
              checked={offboardEmployee}
            />
          </Card> */}
        </div>
      </DrawerRight>
      <SelectAReceiver
        baseRoute={routes.OFFBOARDING}
        isOpen={isSelectReceiverOpen}
        onClose={() => {
          if (getEquipment?.actionType !== "Transfer") {
            return setIsSelectReceiverOpen(!isSelectReceiverOpen);
          }
          return (setIsSelectReceiverOpen(!isSelectReceiverOpen), onClose());
        }}
        employeeDataOptions={employeeDataOptions}
        isLoading={employees_isLoading}
        isError={employees_isError}
        modifyInstance={true}
        modifyInstanceData={equipmentsDB}
        presetEmployeeValue={getEquipment?.receiver?.id}
        handleModifyInstanceSubmit={handleSubmit}
      />
    </div>
  );
};

export default React.memo(ModifyOrder);
