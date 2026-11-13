import Auth from "@/container/Auth";
import BizExpertLogin from "@/container/BizExpert/Auth/BizExpertLogin";
import { isBizExpertApp } from "@/config/product";
import { NextPage } from "next";

const page: NextPage = () => {
  if (isBizExpertApp()) {
    return <BizExpertLogin />;
  }
  return <Auth />;
};

export default page;
