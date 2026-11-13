"use client";

import React from "react";
import DoingTodayQuickActions from "./DoingTodayQuickActions";

const DoingToday = () => {
  return (
    <div className="mt-8">
      <p className="text-base font-semibold text-primary">
        What do you want to do today?
      </p>
      <p className="mt-0.5 text-sm text-tertiary">
        Select an option to manage equipment and employee resources.
      </p>
      <DoingTodayQuickActions />
    </div>
  );
};

export default DoingToday;
