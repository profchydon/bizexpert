import { useAuthUserDetail } from "@/utils/useAuthUser";
import { ICompany } from "@/types/auth";
import AllEquipment from "./AllEquipment";

const AllEquipmentLayout = () => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails() as ICompany;

  return <AllEquipment company={company} />;
};

export default AllEquipmentLayout;
