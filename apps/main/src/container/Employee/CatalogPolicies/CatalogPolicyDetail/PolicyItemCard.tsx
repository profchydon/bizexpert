import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PolicyDisplayItem } from "./utils";

type Props = {
  item: PolicyDisplayItem;
  selectedQuantity: number;
  onAdd: () => void;
  onRemove: () => void;
  addDisabled?: boolean;
  hideActions?: boolean;
  hideQuantity?: boolean;
  quantityLabel?: string;
};

const PolicyItemCard = ({
  item,
  selectedQuantity,
  onAdd,
  onRemove,
  addDisabled,
  hideActions,
  hideQuantity,
  quantityLabel = "Available quantity",
}: Props) => {
  const title = [item.name, item.specs].filter(Boolean).join(" ");
  const canAdd = !addDisabled && selectedQuantity < item.quantity;
  const isSelected = selectedQuantity > 0;
  const isRequired = Boolean(item.required);

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader className="p-6 pb-0">
        <div className="grid h-[150px] place-content-center">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="max-h-[150px] object-contain"
              width={150}
              height={150}
            />
          ) : (
            <span className="text-sm text-gray-400">No available image</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-y-3 p-6">
        <h3
          className="line-clamp-2 min-h-10 text-sm font-semibold text-gray-900"
          title={title}
        >
          {title}
        </h3>
        <div className="flex min-h-6 flex-wrap content-start gap-2">
          {isRequired ? <Badge variant="secondary">Required</Badge> : null}
          {item.category ? <Badge variant="blue">{item.category}</Badge> : null}
          {item.kitName ? <Badge variant="blue">{item.kitName}</Badge> : null}
        </div>
      </CardContent>
      <CardFooter className="mt-auto p-4">
        <div className="flex w-full flex-col gap-y-3">
          <div className="flex items-center justify-between">
            {!hideQuantity ? (
              <div className="flex flex-col gap-y-1">
                <span className="text-xs text-gray-400">{quantityLabel}</span>
                <span className="text-sm font-semibold text-gray-900">
                  {item.quantity}
                </span>
              </div>
            ) : null}
            {isSelected && !isRequired ? (
              <span className="text-xs font-medium text-primary-700">
                {selectedQuantity} selected
              </span>
            ) : null}
          </div>

          {hideActions ? null : isRequired ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-9 border-0 bg-gray-100 text-sm text-gray-500 shadow-none hover:bg-gray-100"
              disabled
              data-testid="policyitemcard-button"
            >
              Add to cart
            </Button>
          ) : isSelected ? (
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-base"
                onClick={onRemove}
                data-testid="policyitemcard-button-2"
              >
                -
              </Button>
              <span className="text-sm font-semibold text-gray-900">
                {selectedQuantity}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-base disabled:pointer-events-auto disabled:cursor-not-allowed"
                disabled={!canAdd}
                onClick={onAdd}
                data-testid="policyitemcard-button-3"
              >
                +
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              size="sm"
              className="h-9 text-sm disabled:pointer-events-auto disabled:cursor-not-allowed"
              disabled={!canAdd}
              onClick={onAdd}
              data-testid="policyitemcard-button-4"
            >
              Add to cart
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default PolicyItemCard;
