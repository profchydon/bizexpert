import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import React, { FC } from "react";

interface Props {
  title: string;
  description: string;
  orderState: boolean;
  setOrderState: (state: boolean) => void;
}
const OrderPolicy: FC<Props> = ({
  title,
  description,
  orderState,
  setOrderState,
}) => {
  return (
    <div className="space-y-4">
      <div className="border-[1px] border-gray-200 bg-white p-4 rounded-lg space-y-2">
        <div className="flex items-start space-x-4">
          <Checkbox
            id="terms"
            className="mt-1 h-5 w-5 rounded border-gray-300 data-[state=checked]:border-primary-600 data-[state=checked]:bg-primary-600"
            checked={orderState}
            onCheckedChange={(checked) => setOrderState(checked as boolean)}
            data-testid="orderpolicy-checkbox"
          />
          <div>
            <Label
              htmlFor="terms"
              className="text-base font-medium text-gray-700"
            >
              {title}
            </Label>
            <p className="text-sm text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPolicy;
