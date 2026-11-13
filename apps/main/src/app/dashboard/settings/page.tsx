import { isBizExpertApp } from "@/config/product";
import Settings from "@/container/Dashboard/Settings";
import BizExpertSettings from "@/container/Dashboard/BizExpertSettings";
import { NextPage } from "next";

const page: NextPage = () => {
  if (isBizExpertApp()) return <BizExpertSettings />;
  return <Settings />;
};

export default page;
