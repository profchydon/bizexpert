import { check_icon_primary_100 } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import createQueryString from "@/utils/createQueryString";
import Image, { StaticImageData } from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { FC } from "react";

export interface Props {
  image: StaticImageData;
  plan: string;
  title: string;
  description: string;
  data: string[];
}
const PricingCard: FC<Props> = (props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { image, plan, title, description, data } = props;

  const onGetStarted = () =>
    router.push(`${pathname}?${createQueryString("stage", "signup")}`);

  return (
    <Card className="w-full p-0 flex flex-col shadow-gray-100">
      <CardHeader className="px-8 pb-0 pt-8 flex flex-col items-center gap-2">
        <Image src={image} alt="pricing_icon" width={40} height={40} />
        <p className="text-xl font-semibold text-primary-700">{plan}</p>
        <CardTitle className="text-5xl text-gray-900 font-semibold">
          {title}
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <ul className="w-full flex flex-col gap-4">
          {data?.map((item, index) => (
            <li key={index} className="flex flex-row items-start space-x-3">
              <Image
                src={check_icon_primary_100}
                alt="list_icon"
                width={24}
                height={24}
              />
              <p className="text-gray-600">{item}</p>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="p-8 mt-auto bg-gray-50">
        <Button
          className="w-full"
          variant={plan.toLowerCase() !== "request" ? "primary" : "outline"}
          onClick={() => plan.toLowerCase() !== "reuqest" && onGetStarted()}
          data-testid="pricingcard-button"
        >
          {plan.toLowerCase() !== "request" ? "Get started" : "Fill form"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
