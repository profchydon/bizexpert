import { Suspense } from "react";
import OrderSummaryContainer from "@/container/Dashboard/Storage/OrderSummary";
import { NextPage } from "next";

const page: NextPage = () => {
  return (
    <Suspense>
      <OrderSummaryContainer />
    </Suspense>
  );
};

export default page;
