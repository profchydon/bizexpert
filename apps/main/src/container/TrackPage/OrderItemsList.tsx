import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { roundedImage_placeholder } from "@/assets/images";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar, CircleHelp, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Item {
  name: string;
  specs: string;
  quantity: number;
  image?: string;
}

interface OrderItemsListProps {
  items: Item[];
  unavailable?: boolean;
  status?: string;
  orderDate?: string;
  trackingLink?: string;
}

export const OrderItemsList = ({
  items,
  unavailable = false,
  status,
  orderDate,
  trackingLink,
}: OrderItemsListProps) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const hasTrackingLink = Boolean(trackingLink?.trim());
  const trackingDescription = hasTrackingLink
    ? "Open this link to track your shipment directly on the courier's website."
    : "No external courier tracking link is available yet. Please use the order tracking timeline on this page for the latest updates.";

  const formattedDate = orderDate
    ? format(new Date(orderDate), "MMM dd, yyyy")
    : null;

  return (
    <Card className="p-2 sm:p-4 shadow-none">
      <CardContent className="p-2 sm:p-5 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 flex-wrap">
          <div className="flex flex-row gap-x-2 items-center">
            <Calendar className="w-4 h-4 shrink-0" />
            <p className="font-normal text-gray-700 text-sm sm:text-base">
              Order Details
            </p>
          </div>
          <div className="flex flex-row items-center text-gray-500 space-x-2 text-sm">
            <span>Order placed:</span>
            {(status || formattedDate) && (
              <p className="text-xs sm:text-sm text-gray-500">
                {formattedDate}
              </p>
            )}
          </div>

          {unavailable ? (
            <Badge variant="destructive">Unavailable</Badge>
          ) : (
            <Badge variant="blue">
              {totalItems} {totalItems === 1 ? "Item" : "Items"}
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1 text-sm text-gray-700">
            <span>Courier tracking link</span>
            <CircleHelp className="w-3.5 h-3.5 text-gray-400" />
          </div>

          <div className="flex items-center gap-2">
            <Input
              value={trackingLink || ""}
              readOnly
              className="h-10 bg-gray-50 border-gray-300 text-gray-500"
              placeholder="https://track.dhl.com/1234567..."
              data-testid="orderitemslist-input"
            />
            {hasTrackingLink ? (
              <Button
                variant="outline"
                size="md"
                className="h-10 px-4 border-gray-300 text-gray-700 hover:bg-gray-50"
                asChild
                data-testid="orderitemslist-button"
              >
                <a href={trackingLink} target="_blank" rel="noreferrer">
                  Track
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="md"
                disabled
                className="h-10 px-4 border-gray-300 text-gray-500"
                data-testid="orderitemslist-button-2"
              >
                Track
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
          <p className="text-xs text-gray-500">{trackingDescription}</p>
        </div>

        <Separator />

        <div className="space-y-4">
          <p className="font-normal text-xs sm:text-sm text-gray-600 uppercase tracking-wide">
            Items:
          </p>
          {items.length === 0 ? (
            <Badge variant="pending">No items available</Badge>
          ) : (
            items.map((item) => (
              <div
                key={`${item.name}-${item.specs}-${item.quantity}`}
                className="flex gap-3 sm:gap-4 items-start"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      <Image src={roundedImage_placeholder} alt="Image" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-xs sm:text-sm min-w-0">
                  <p className="font-medium leading-snug break-words text-gray-900">
                    {item.name}
                  </p>
                  <p className="text-gray-500 break-words">{item.specs}</p>
                  <p className="mt-1 text-primary-600">Qty: {item.quantity}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
