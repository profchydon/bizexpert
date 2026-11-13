import { Card, CardContent } from "@/components/ui/card";
import formatAmount from "@/utils/formatAmount";
import { Earth } from "lucide-react";
import React from "react";

const items = [
  {
    icon: <Earth />,
    name: "Total storage locations",
    value: "15",
  },
  {
    icon: <Earth />,
    name: "Total items in storage",
    value: "1,300",
  },
];

const MetricDetails: React.FC<{
  itemsInStorage: number;
  storagelLocationCount: number;
}> = ({ itemsInStorage, storagelLocationCount }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-x-3">
            <div className="rounded-full p-3 bg-gray-50 h-fit">
              <Earth />
            </div>
            <div className="flex flex-col gap-y-2">
              <h3 className="font-semibold text-sm text-gray-600">
                Total storage locations
              </h3>
              <span className="text-3xl font-bold text-gray-900">
                {formatAmount(storagelLocationCount.toString())}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-x-3">
            <div className="rounded-full p-3 bg-gray-50 h-fit">
              <Earth />
            </div>
            <div className="flex flex-col gap-y-2">
              <h3 className="font-semibold text-sm text-gray-600">
                Total items in storage
              </h3>
              <span className="text-3xl font-bold text-gray-900">
                {formatAmount(itemsInStorage.toString())}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricDetails;
