import React from "react";
import PricingCard, { Props } from "./PricingCard";
import { request_icon_primary_100 } from "@/assets/icons";

const planData: Props[] = [
  {
    image: request_icon_primary_100,
    plan: "Request",
    title: "Per device",
    description: "Here you can fill a form and request for a device.",
    data: ["Ability to onboard employees", "Ability to off-board employees"],
  },
  {
    image: request_icon_primary_100,
    plan: "Business plan",
    title: "$20/mth",
    description: "Billed annually.",
    data: [
      "Streamlined onboarding & off-boarding of employee’s",
      "Ability to onboard employees",
      "Advanced reporting",
      "Share catalog to employees",
      "Priority chat and email support",
      "Account officer",
    ],
  },
];
const CardContainer = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full xl:w-[44rem]">
      {planData?.map((items, index) => {
        const { image, plan, title, description, data } = items;

        return (
          <PricingCard
            key={index}
            image={image}
            plan={plan}
            title={title}
            description={description}
            data={data}
          />
        );
      })}
    </div>
  );
};

export default CardContainer;
