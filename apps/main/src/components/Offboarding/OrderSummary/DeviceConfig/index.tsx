import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronRight } from "lucide-react";
import React, { useState } from "react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  description: string;
  perDevice?: boolean;
}
const DeviceConfig = () => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const items: OrderItem[] = [
    {
      id: "wipe",
      name: "Device wipe",
      price: 40,
      description:
        "Permanently delete all data from your device to protect your privacy before returning or repurposing it.",
      perDevice: true,
    },
    {
      id: "check",
      name: "Equipment check",
      price: 80,
      description:
        "Ensure optimal performance with our maintenance service, including updates, checks, and repairs.",
      perDevice: true,
    },
  ];

  const handleCheckItem = (itemId: string) => {
    setCheckedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      }
      return [...prev, itemId];
    });
  };
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="flex p-4 items-center justify-between">
          <div className="flex items-start space-x-4">
            <Checkbox
              id={item.id}
              checked={checkedItems.includes(item.id)}
              onCheckedChange={() => handleCheckItem(item.id)}
              className="mt-1.5 h-5 w-5 border-gray-300 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 rounded-full"
              data-testid="deviceconfig-checkbox"
            />
            <div className="flex-1">
              <div className="flex justify-between">
                <Label
                  htmlFor={item.id}
                  className="text-base font-medium text-gray-700"
                >
                  {item.name}
                  {item.perDevice && (
                    <span className="text-gray-600 ml-2 font-normal">
                      ${item.price} per device
                    </span>
                  )}
                </Label>
              </div>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
          <ChevronRight className="text-gray-500" size={32} />
        </Card>
      ))}
    </div>
  );
};

export default DeviceConfig;
