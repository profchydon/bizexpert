import { ArrowRight, RefreshCcw, Database, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Offboard_asset } from "@/types/offboarding";
import { getInitials } from "@/utils/getInitials";
import { SafeImage } from "@/components/SafeImage";
import truncate from "lodash/truncate";
interface ItemCardProps {
  item: Offboard_asset;
  onEdit: () => void;
  onRemove?: () => void;
}

const ActionIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "Transfer":
      return (
        <Badge variant="blue" className="flex flex-row items-center gap-1">
          <RefreshCcw size={14} /> Reassign
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

const ActionCard = ({ item, onEdit, onRemove }: ItemCardProps) => {
  return (
    <Card className="bg-white flex flex-col gap-y-3 rounded-xl w-full text-gray-600 p-4">
      <CardHeader className="flex flex-row items-center space-x-2 p-0">
        <div className="rounded-full w-[40px] flex flex-col justify-center items-center h-[40px] bg-gray-100">
          <SafeImage
            src={item?.image_url}
            alt={item?.title}
            className="w-full object-fill rounded-full"
            width={40}
            height={40}
          />
        </div>
        <p className="text-sm text-gray-700 font-semibold text-left">
          {truncate(`${item?.title} ${item?.make} (${item?.year})`, {
            length: 40,
          })}
        </p>
      </CardHeader>
      {item?.receiver && item?.assignee && (
        <CardContent className="p-0 flex flex-row items-center gap-3">
          <div className="flex flex-row items-center gap-2">
            <Avatar className="h-[24px] w-[24px]">
              <AvatarFallback className="text-gray-600 text-sm font-medium bg-gray-100">
                {getInitials(`${item?.assignee?.name}`)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-700 font-semibold">
              {item?.assignee?.name}
            </span>
          </div>
          <ArrowRight className="h-3 w-3 text-primary-700" />
          <div className="flex flex-row items-center gap-2">
            <Avatar className="h-[24px] w-[24px]">
              <AvatarFallback className="text-gray-600 text-sm font-medium bg-gray-100">
                {getInitials(
                  `${item?.receiver?.first_name} ${item?.receiver?.last_name}`,
                )}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-700 font-semibold">
              {truncate(
                `${item?.receiver?.first_name} ${item?.receiver?.last_name}`,
                { length: 20 },
              )}
            </span>
          </div>
        </CardContent>
      )}
      <Separator />
      <CardFooter className="p-0 flex flex-row items-center gap-3">
        <ActionIcon type={item?.actionType as string} />
        <div className="flex flex-row items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="text-primary-700"
            data-testid="actioncard-button"
          >
            <span className="text-sm font-semibold">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-gray-600"
            data-testid="actioncard-button-2"
          >
            <span className="text-sm font-semibold text-gray-600">Remove</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ActionCard;
