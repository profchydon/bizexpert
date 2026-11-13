import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import React from "react";

const StorageExpDetails = () => {
  return (
    <Card className="flex flex-col h-full">
      <CardContent className="p-6 space-y-6 flex-1">
        <h3 className="text-gray-900 text-lg font-semibold">
          Storage expiring soon
        </h3>

        <div className="flex gap-x-6 items-center">
          <div className="p-10 bg-gray-50 h-fit rounded-full">
            <Calendar className="text-gray-500" size={50} />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label className="text-base text-gray-900">
              Expiring in 30 Days
            </Label>
            <span className="text-sm">
              Your storage agreement for the selected items will expire soon.
              Renew your agreement or remove items before the deadline.
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="mt-auto py-6 border-t block">
        <div className="grid place-content-end">
          <Button
            variant={"outline"}
            className="text-sm font-medium"
            data-testid="storageexpdetails-button"
          >
            View Expiring Items
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default StorageExpDetails;
