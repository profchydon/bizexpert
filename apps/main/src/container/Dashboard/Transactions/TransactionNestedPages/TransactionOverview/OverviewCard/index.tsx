import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";
import OverViewHeader from "./overViewHeader";
import ExpensesLayout from "./ExpensesLayout";
import { cash_spent_icon, credit_spent_icon } from "@/assets/icons";
import PaymentOverviecChart from "./PaymentOverviecChart";
import { Separator } from "@/components/ui/separator";

interface Props {
  selectedValue: string;
  onHandleChange: (value: string) => void;
}
const OverviewCard: React.FC<Props> = ({ selectedValue, onHandleChange }) => {
  const totalExpenses = [
    {
      image: credit_spent_icon,
      description: "Total Credit Spent",
      amount: "$0.00",
    },
    {
      image: cash_spent_icon,
      description: "Total Cash Spent",
      amount: "$0.00",
    },
  ];

  return (
    <div>
      <Card className="p-4 flex flex-col gap-6">
        <CardHeader className="p-0 border-b border-border-secondary flex flex-col gap-4 pb-6">
          <OverViewHeader
            selectedValue={selectedValue}
            onHandleChange={onHandleChange}
          />
        </CardHeader>

        <CardContent className="px-0 pt-0 pb-2 flex flex-col gap-6">
          <ExpensesLayout data={totalExpenses} />
          <Separator />
          <PaymentOverviecChart />
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewCard;
