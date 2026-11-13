import { Button } from "@/components/ui/button";
import { IOrder } from "@/types/orders";
import { ArrowRight } from "lucide-react";

const OrderTableActions: React.FC<{
  item?: IOrder;
  onView: () => void;
}> = ({ onView }) => {
  return (
    <div className="grid place-content-end">
      <Button
        className="text-primary-700 font-semibold w-auto text-[12px] flex items-center gap-x-1"
        variant="ghost"
        size="sm"
        onClick={onView}
        data-testid="ordertableactions-button"
      >
        View <ArrowRight />
      </Button>
    </div>
  );
};

export default OrderTableActions;
