import React, { FC, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import routes from "@/routes";
import { useAppDispatch } from "@/store";
import { resetEquipEmployeeState } from "@/store/slices/equipEmployeeSlice";
import { ICompany } from "@/types/auth";
import dynamic from "next/dynamic";

const CountriesTable = dynamic(() => import("./CountriesTable"));
const AllEquipmentsTable = dynamic(
  () => import("@/components/AllEquipments/AllEquipmentsTable"),
);

interface Props {
  company: ICompany;
}

const DeviceRefreshContent: FC<Props> = ({ company }) => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const isEquipment = searchParams.get("isEquipment");

  useEffect(() => {
    dispatch(resetEquipEmployeeState());
  }, [dispatch]);

  if (isEquipment) {
    return (
      <AllEquipmentsTable
        baseRoute={routes.All_Equipments}
        isActionDrawerOpen={false}
        setIsActionDrawerOpen={() => {}}
        refresh_status={true}
      />
    );
  }

  return <CountriesTable />;
};

export default DeviceRefreshContent;
