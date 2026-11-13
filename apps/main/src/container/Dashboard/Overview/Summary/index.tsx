import React from "react";
import SummaryCard from "./SummaryCard";
import {
  Users,
  ShoppingBag,
  Truck,
  MessageSquarePlus,
  Banknote,
} from "lucide-react";
import { ICard } from "@/types/dashboard";
import { companyBillingCurrencySymbol } from "@/utils/companyBillingCurrency";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import millify from "millify";
import { overviewMetricGridClass } from "../overviewDashboardClasses";

interface Props {
  summaryData: ICard;
  currencySymbol?: string;
}

const Summary: React.FC<Props> = ({ summaryData, currencySymbol }) => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();

  const displayCurrency =
    currencySymbol ?? companyBillingCurrencySymbol(company);

  return (
    <div className={overviewMetricGridClass}>
      <SummaryCard
        description={summaryData.total_employees}
        title="Total employees"
        icon={<Users className="text-white" />}
      />
      <SummaryCard
        description={summaryData.total_inventory}
        title="Total inventory"
        icon={<ShoppingBag className="text-white" />}
      />
      <SummaryCard
        description={summaryData.total_active_orders}
        title="Active orders"
        icon={<Truck className="text-white" />}
      />
      <SummaryCard
        description={summaryData.total_active_catalogs}
        title="Active catalogs"
        icon={<MessageSquarePlus className="text-white" />}
      />
      <div className="hidden lg:block">
        <SummaryCard
          description={`${displayCurrency} ${millify(
            summaryData.total_order_value,
            { precision: 2 },
          )}`}
          title="Total order value"
          icon={<Banknote className="text-white" />}
        />
      </div>
    </div>
  );
};

export default Summary;
