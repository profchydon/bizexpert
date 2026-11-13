import { isBizExpertApp } from "@/config/product";
import Overview from "@/container/Dashboard/Overview";
import { InventoryOverviewBody } from "@/container/Dashboard/Overview/InventoryOverviewBody";
import { NextPage } from "next";

const page: NextPage = () => {
  if (isBizExpertApp()) {
    return <InventoryOverviewBody />;
  }
  return <Overview />;
};

export default page;
