import { RefreshCcw, Database, ShoppingCart, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { roundedImage_placeholder } from "@/assets/images";
import { Separator } from "@/components/ui/separator";
import { Offboard_asset } from "@/types/offboarding";
import Image from "next/image";
import truncate from "lodash/truncate";
import { IEquipmentsInStorageByCountry } from "@/types/equipments";

interface ItemCardProps {
  item: IEquipmentsInStorageByCountry;
  onRemove?: () => void;
}

const ActionIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "Transfer":
      return (
        <Badge variant="blue" className="flex flex-row items-center gap-1">
          <UserPlus size={14} /> Assign
        </Badge>
      );
    case "Store":
      return (
        <Badge variant="gray" className="flex flex-row items-center gap-1">
          <Database size={14} /> Store
        </Badge>
      );
    case "Sale":
      return (
        <Badge variant="red" className="flex flex-row items-center gap-1">
          <ShoppingCart size={14} /> Sale
        </Badge>
      );
    default:
      return null;
  }
};

const ActionCard = ({ item, onRemove }: ItemCardProps) => {
  return (
    <Card className="bg-white flex flex-col gap-y-3 rounded-xl w-full text-gray-600 p-4">
      <CardHeader className="flex flex-row items-center space-x-2 p-0">
        <div className="rounded-full w-[40px] flex flex-col justify-center items-center h-[40px] bg-gray-100">
          <Image
            src={item?.image_url || roundedImage_placeholder}
            alt={item?.title}
            className="w-full object-fill rounded-full"
            width={40}
            height={40}
          />
        </div>
        <p className="text-sm text-gray-700 font-semibold text-left">
          {truncate(`${item?.title}`, {
            length: 40,
          })}
        </p>
      </CardHeader>

      <Separator />
      <CardFooter className="p-0 flex flex-row items-center gap-1">
        <ActionIcon type={item?.actionType as string} />
        <div className="flex flex-row items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-gray-600"
            data-testid="actioncard-button"
          >
            <span className="text-sm font-semibold text-gray-600">Remove</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ActionCard;
