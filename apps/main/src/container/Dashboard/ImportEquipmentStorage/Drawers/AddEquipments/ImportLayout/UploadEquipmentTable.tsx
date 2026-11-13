import { IAddEquipment } from "@/types/equipments";
import { useRouter, useSearchParams } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import qs from "qs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  resetImportedEquipment,
  setImportedEquipment,
} from "@/store/slices/equipmentSlice";
import { removeUserscore } from "@/utils/underScoreTransformer";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { ArrowLeft } from "lucide-react";
import { RefreshCcw } from "lucide-react";
import { roundedImage_placeholder } from "@/assets/images";
import EditUploadedEquipment from "./EditUploadedEquipments";
import routes from "@/routes";

interface Props {
  onClose: () => void;
  clearArrayData: () => void;
}
const UploadEquipmentTable: FC<Props> = ({ clearArrayData, onClose }) => {
  const searchParams = useSearchParams();
  const getData = searchParams.get("equipment_data");
  const getEditInstance = searchParams.get("#");
  const getEditIDInstance = searchParams.get("#");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const equipmentData = useAppSelector(
    (state) => state.persistedReducers.equipment?.importedEquipment,
  ) as IAddEquipment[];

  const companyId = useWorkspaceCompanyId();

  const {
    data: getEmployees,
    // isLoading,
    // isError,
  } = useGetEmployeesQuery({ companyId: companyId! }, { skip: !companyId });
  // @ts-ignore
  const employeeData = getEmployees?.data?.data;

  const renderEmployeeByID = (employee_id: string) => {
    if (!employee_id) return null;
    const getEmployee = employeeData?.find(
      (employee: any) => employee.id === employee_id,
    );
    return `${getEmployee?.first_name || ""} ${getEmployee?.last_name || ""}`;
  };

  const removeUser = (equipment_id: string) => {
    const removePreviousEquipment = equipmentData?.filter(
      (equipment) => Number(equipment.id) !== Number(equipment_id),
    );

    dispatch(setImportedEquipment(removePreviousEquipment as IAddEquipment[]));
  };

  const handleCancel = () => {
    onClose();
    clearArrayData();
    dispatch(resetImportedEquipment());
    // setDataArray([]);
    router.push(routes.IMPORT_EQUIPMENT_STORAGE);
  };

  const [editInstance, setEditInstance] = useState(false);
  const toggleEditInstance = () => {
    setEditInstance(!editInstance);
  };

  const handleLoad = () => {
    window.location.reload();
  };

  return (
    <>
      {!editInstance ? (
        <div className="flex flex-col pl-0 max-[545px]:w-96 w-full overflow-x-auto">
          <div className="rounded-lg border border-gray-200 mx-6 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[174px] max-[345px]:pl-6">
                    Asset
                  </TableHead>
                  <TableHead className="w-[174px]">Collectors Name</TableHead>
                  <TableHead className="w-[174px]">Email Address</TableHead>
                  <TableHead className="w-[174px]">Storage duration</TableHead>

                  <TableHead className="w-[115px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipmentData
                  // ?.sort((a, b) => a.id - b.id)
                  ?.map((equipment) => {
                    return (
                      <TableRow key={equipment.id} className="text-sm">
                        <TableCell>
                          <div className="flex flex-row gap-3 items-center">
                            <div className="rounded-full w-[40px] flex flex-col justify-center items-center h-[40px] bg-gray-100">
                              <Image
                                src={
                                  equipment?.imageUrl ||
                                  roundedImage_placeholder
                                }
                                alt={"equipment_image"}
                                className="w-full object-fill rounded-full"
                                width={40}
                                height={40}
                              />
                            </div>

                            <div className="flex flex-1 flex-col gap-y-1">
                              <span className="text-gray-900 font-medium">
                                {equipment?.title || "----"}
                              </span>
                              <span className="text-gray-600 w-[174px] truncate">
                                {equipment?.serial_number || "----"}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col gap-y-1">
                            <span
                              className="text-gray-900 w-[96px] truncate"
                              title={equipment?.assignee}
                            >
                              {!equipment?.assignee
                                ? "Olivia Rhaye"
                                : renderEmployeeByID(
                                    String(equipment?.assignee),
                                  )}
                            </span>
                            <span className="">
                              {removeUserscore(equipment?.state || "") ||
                                "----"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col gap-y-1 pt-1 font-normal">
                            <span
                              className="text-gray-900 w-[96px] truncate"
                              title="Olivia@gmail.com"
                            >
                              Olivia@gmail.com
                            </span>
                            <span>+2347016929130</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col gap-y-1 pt-1 font-normal">
                            <span
                              className="text-gray-900 w-[96px] truncate"
                              title="Olivia@gmail.com"
                            >
                              Pick up at 02/03/2025
                            </span>
                            <span>3 months</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex gap-x-2">
                            <span
                              className="text-sm font-semibold cursor-pointer"
                              onClick={() => removeUser(equipment?.id)}
                            >
                              Delete
                            </span>
                            <span
                              className="text-sm text-primary-700 font-semibold cursor-pointer"
                              onClick={toggleEditInstance}
                            >
                              Edit
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>

          <div className="fixed bottom-0 w-full py-4 px-6 border-t bg-white border-gray-200">
            <div className="flex flex-row justify-between items-center h-full my-auto">
              <div>
                <Button
                  className="text-sm flex gap-x-2 items-center font-semibold text-primary-700"
                  variant="outline"
                  onClick={handleLoad}
                  data-testid="uploadequipmenttable-button"
                >
                  <RefreshCcw className="w-5 h-5" onClick={handleLoad} />
                  Reload
                </Button>
              </div>

              <div className="flex gap-x-4">
                <Button
                  type="button"
                  className="text-sm font-semibold gap-x-2 items-center"
                  variant="outline"
                  onClick={handleCancel}
                  data-testid="uploadequipmenttable-button-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </Button>
                <Button
                  type="button"
                  className="text-sm font-semibold"
                  data-testid="uploadequipmenttable-button-3"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EditUploadedEquipment
          isOpen={editInstance}
          onClose={onClose}
          edit_instance={true}
        />
      )}
    </>
  );
};

export default UploadEquipmentTable;
