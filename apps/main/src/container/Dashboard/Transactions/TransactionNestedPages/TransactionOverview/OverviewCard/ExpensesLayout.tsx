import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image, { StaticImageData } from "next/image";
import React from "react";

interface I_Expenses {
  image: StaticImageData;
  description: string;
  amount: string;
}
interface Props {
  data: I_Expenses[];
}

const ExpensesLayout: React.FC<Props> = ({ data }) => {
  return (
    <div className="flex flex-row items-center gap-6 w-full">
      {data?.map(({ image, description, amount }, index) => (
        <Card
          key={index}
          className="p-6 flex flex-col gap-4 w-full rounded-xl shadow"
        >
          <CardHeader className="p-0 flex flex-row items-center gap-5">
            <Image
              src={image || ""}
              alt="expenses_icon"
              width={48}
              height={48}
            />
            <p className="text-gray-900 font-medium text-base">{description}</p>
          </CardHeader>
          <CardContent className="p-0">
            <h1 className="text-4xl text-gray-900 font-semibold">{amount}</h1>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ExpensesLayout;
