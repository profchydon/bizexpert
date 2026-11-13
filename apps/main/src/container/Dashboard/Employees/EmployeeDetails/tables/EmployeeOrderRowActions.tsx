"use client";

import { Button } from "@/components/base/buttons/button";
import { useScopedViewNavigation } from "@/hooks/useViewNavigation";

type Props = {
  orderId: string;
  viewHref: string;
};

const EmployeeOrderRowActions = ({ orderId, viewHref }: Props) => {
  const { view, isViewLoading } = useScopedViewNavigation();

  return (
    <div className="flex justify-end">
      <Button
        color="link-color"
        size="sm"
        isLoading={isViewLoading(orderId)}
        isDisabled={isViewLoading(orderId)}
        onPress={() => view(viewHref, orderId)}
        data-testid="employeeorderrowactions-button"
      >
        View
      </Button>
    </div>
  );
};

export default EmployeeOrderRowActions;
