"use client";

import { OverviewInviteButton } from "./OverviewInviteButton";

const OverviewDashboardHeader = () => {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-primary">Overview</h1>
        <p className="mt-1 text-sm text-tertiary">
          A quick snapshot of your account
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <OverviewInviteButton />
      </div>
    </div>
  );
};

export default OverviewDashboardHeader;
