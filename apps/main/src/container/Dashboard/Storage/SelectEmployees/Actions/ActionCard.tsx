import { Database, ShoppingCart, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import truncate from "lodash/truncate";
import { IEmployees } from "@/types/employees";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback } from "@/components/ui/avatar";

interface ItemCardProps {
  item: IEmployees;
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
      <CardHeader className="flex flex-row items-center space-x-3 p-0">
        <div className="rounded-full w-[40px] h-[40px] bg-gray-100">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="text-gray-600 bg-gray-100">
              {`${item?.first_name?.[0]} ${item?.last_name?.[0]}`}
            </AvatarFallback>
          </Avatar>
        </div>
        <p className="text-sm flex flex-col">
          <span className="text-sm text-gray-700 font-semibold text-left">
            {truncate(`${item?.first_name} ${item?.last_name}`, {
              length: 40,
            })}
          </span>
          <span>
            {item?.job_title ?? <Badge variant="red">Not available</Badge>}
          </span>
        </p>
      </CardHeader>

      <Separator />
      <CardFooter className="p-0 flex flex-row items-center gap-1">
        <ActionIcon type={"Transfer"} />
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
