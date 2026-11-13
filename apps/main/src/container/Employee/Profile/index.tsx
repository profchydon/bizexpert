import PageHeader from "@/components/PageHeader";
import React from "react";
import ProfileForm from "./ProfileForm";

const EmployeeProfile = () => {
  return (
    <div className="pb-6">
      <PageHeader
        pageDescription="Manage your catalogs, orders and assets here."
        pageTitle="Settings"
      />

      <div>
        <ProfileForm />
      </div>
    </div>
  );
};

export default EmployeeProfile;
