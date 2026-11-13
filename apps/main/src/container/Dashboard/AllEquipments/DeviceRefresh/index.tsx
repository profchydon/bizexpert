import PageHeader from "@/components/PageHeader";
import { ICompany } from "@/types/auth";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import React, { FC } from "react";
import DeviceRefreshContent from "./DeviceRefreshContent";

interface Props {
  company: ICompany;
}

const DeviceRefresh: FC<Props> = ({ company }) => {
  const { back } = useTransitionRouter();

  return (
    <div className="flex flex-col py-8">
      <PageHeader
        breadCrumbs={["Device Refresh"]}
        pageTitle="Device Refresh"
        pageDescription="Track and refresh employee devices before they reach end-of-life."
        onBack={() => back()}
      />
      <div className="mt-8">
        <DeviceRefreshContent company={company} />
      </div>
    </div>
  );
};

export default DeviceRefresh;
