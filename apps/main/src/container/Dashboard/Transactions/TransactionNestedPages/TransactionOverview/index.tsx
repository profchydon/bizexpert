import React from "react";
import OverviewCard from "./OverviewCard";

interface Props {
  selectedValue: string;
  onHandleChange: (value: string) => void;
}
const PaymentOverview: React.FC<Props> = ({
  selectedValue,
  onHandleChange,
}) => {
  return (
    <div>
      <OverviewCard
        selectedValue={selectedValue}
        onHandleChange={onHandleChange}
      />
    </div>
  );
};

export default PaymentOverview;
