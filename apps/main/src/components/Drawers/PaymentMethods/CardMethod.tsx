import {
  checkbox_gray_300,
  checkbox_primary_600,
  // flutterwave_icon,
  stripe_icon,
} from "@/assets/icons";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import Image from "next/image";
import { FC, useEffect } from "react";
import TotalFeeSummary from "./TotalFeeSummary";
import type { FeeRow, FeeSummaryLike } from "@/lib/tax/feeSummary";

const mockData = [
  // {
  //   id: "1",
  //   card_name: "Pay with Flutter wave",
  //   image: flutterwave_icon,
  //   gateway: "Flutterwave",
  //   color: "#FB9129",
  // },
  {
    id: "2",
    card_name: "Pay with Stripe",
    image: stripe_icon,
    gateway: "Stripe",
    color: "#635BFF",
  },
];

interface Props {
  selectedCardValue?: string;
  handleCardSelection?: (value: string) => void;
  totalItems: number;
  currencySymbol: string;
  totalFee: number;
  totalFeesArray: FeeRow[];
  totalFeesSummary?: FeeSummaryLike;
}
const CardMethod: FC<Props> = (props) => {
  const {
    selectedCardValue,
    handleCardSelection,
    totalItems,
    totalFee,
    currencySymbol,
    totalFeesArray,
  } = props;

  const { getCompanyDetails } = useAuthUserDetail();
  const payment_processor = getCompanyDetails()?.country?.payment_processor;

  useEffect(() => {
    if (payment_processor) {
      handleCardSelection?.(payment_processor);
    }
  }, [payment_processor]);

  return (
    <div className="h-screen flex flex-col gap-y-2">
      <div className="flex flex-col mb-2">
        <p className="text-sm font-medium text-gray-700">
          Select payment method
        </p>
        <p className="text-sm text-gray-600">
          Pay via any one of these available payment methods
        </p>
      </div>

      <ToggleGroup
        type="single"
        defaultValue={selectedCardValue}
        value={selectedCardValue}
        className="w-full gap-y-3 px-0 flex flex-col items-start justify-between mt-8"
        onValueChange={(value: string) => handleCardSelection?.(value)}
      >
        {mockData?.map((item, index) => {
          const { card_name, id, image, gateway, color } = item;
          return (
            <ToggleGroupItem
              key={index}
              variant="outline"
              value={gateway}
              disabled={gateway !== payment_processor}
              className="w-full h-auto px-0 py-0 border-0"
            >
              <div className="flex flex-col w-full">
                <Card
                  className={cn(
                    "p-0 rounded-xl w-full text-gray-600 cursor-pointer",
                  )}
                >
                  <CardContent
                    className={cn(
                      "p-4 grid place-content-center rounded-xl text-white",
                    )}
                    style={{ backgroundColor: color }}
                  >
                    <div className="flex justify-between gap-x-2">
                      <div className="flex flex-row items-center space-x-2">
                        <Image
                          width={34}
                          height={32}
                          src={image}
                          alt="card_icon"
                        />
                        <div className="space-y-1 flex flex-col items-start">
                          <p
                            className={cn(
                              "text-sm font-medium text-center flex flex-row items-center gap-x-1 text-white",
                              `${selectedCardValue === id && "text-primary-800"}`,
                            )}
                          >
                            <span>{card_name}</span>
                          </p>
                        </div>
                      </div>

                      {selectedCardValue !== gateway ? (
                        <Image
                          src={checkbox_gray_300}
                          alt="check_primary_icon"
                          width={17}
                          height={17}
                        />
                      ) : (
                        <Image
                          src={checkbox_primary_600}
                          alt="check_primary_icon"
                          width={17}
                          height={17}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>

      <TotalFeeSummary
        currencySymbol={currencySymbol!}
        totalEquipment={totalItems!}
        totalFee={totalFee}
        totalFeesArray={totalFeesArray}
        totalFeesSummary={props.totalFeesSummary}
      />
    </div>
  );
};

export default CardMethod;
