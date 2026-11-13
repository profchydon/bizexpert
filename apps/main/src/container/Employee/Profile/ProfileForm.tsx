"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import PersonalInfo from "./PersonalInfo";
import Password from "./Password";

const ProfileForm = () => {
  return (
    <div className="px-6 pt-6">
      <PersonalInfo />

      {/* <Password /> */}
    </div>
  );
};

export default ProfileForm;
