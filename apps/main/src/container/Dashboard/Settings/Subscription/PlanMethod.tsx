import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FiArrowUpRight } from "react-icons/fi";

import React from "react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import stripe from "@/assets/images/Stripe.svg";
import flutterwave from "@/assets/images/flutterwave.png";
import { ISubscription } from "@/types/subscriptions";
import formatAmount from "@/utils/formatAmount";
import { companyBillingCurrencySymbol } from "@/utils/companyBillingCurrency";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { subscriptionPaymentLabel } from "./subscriptionPaymentLabel";
dayjs.extend(advancedFormat);

interface Props {
  togglePlans: () => void;
  subscription: ISubscription;
}
const PlanMethod: React.FC<Props> = ({ togglePlans, subscription }) => {
  const [progress, setProgress] = React.useState(100);
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();

  const plan = subscription?.plan;
  const price = subscription?.price;
  const subcompany = subscription?.company;

  return (
    <div className="flex flex-row items-center gap-6 w-full">
      <Card className="h-[14.5625rem] w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-gray-900 text-lg font-medium flex flex-row items-center gap-3">
              {plan.name}
              <Badge className="bg-primary-50 text-primary-700">Yearly</Badge>
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm">
              {plan.description}
            </CardDescription>
          </div>
          <div className="flex flex-row items-end gap-2">
            <h1 className="text-gray-900 text-5xl font-semibold">
              {companyBillingCurrencySymbol(company)}
              {formatAmount(price.amount)}
            </h1>
            <p className="text-gray-600 text-base font-medium">per year</p>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {/* <p className="text-gray-900 text-sm">1 of 1 user</p> */}
          <Progress value={progress} className="w-full" />
        </CardContent>
        <CardFooter className="flex flex-row items-center justify-between">
          <p className="text-sm font-semibold text-gray-600">
            Expiring on the{" "}
            <span className="text-primary-600">
              {dayjs(subscription.end_date).format("Do MMM, YYYY h:mmA")}
            </span>{" "}
          </p>
          <p
            className="text-sm font-semibold text-primary-700 flex flex-row items-center gap-2 cursor-pointer"
            onClick={togglePlans}
          >
            Change plan <FiArrowUpRight size="18" />
          </p>
        </CardFooter>
      </Card>
      <Card className="p-6 flex flex-col gap-5 h-[14.5625rem] w-full">
        <CardHeader className="flex flex-col gap-0 p-0">
          <CardTitle className="text-gray-900 text-lg font-medium flex flex-row items-center">
            Payment method
          </CardTitle>
          <CardDescription className="text-gray-600 text-sm">
            Change how you pay for your plan.
          </CardDescription>
        </CardHeader>
        <CardContent className=" flex flex-row gap-3 border border-gray-200 p-4 rounded-lg">
          <Image
            src={
              subcompany.base_country?.payment_processor === "Flutterwave"
                ? flutterwave
                : stripe
            }
            alt="payment_icon"
            width={100}
            height={40}
          />

          <div className="flex flex-col gap-1 ml-4">
            <p className="text-gray-900 text-sm">
              {subscriptionPaymentLabel(subcompany)}
            </p>
            <p className="text-gray-600 text-sm">{company?.email}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanMethod;
