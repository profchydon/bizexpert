import AssignmentFlow from "@/container/Dashboard/EquipEmployee/AssignmentFlow";
import DeviceRefreshFlowRedirect from "@/components/DeviceRefreshFlowRedirect";
import { NextPage } from "next";

const page: NextPage = () => (
  <DeviceRefreshFlowRedirect>
    <AssignmentFlow />
  </DeviceRefreshFlowRedirect>
);

export default page;
