import React from "react";
import OrderInformationTable from "../OrderInformationTable";
import OrderUpdates from "../OrderUpdates";
import { IOrder, ISubOrder } from "@/types/orders";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  order: IOrder;
  canUpdateSignature?: boolean;
  selectedExternalRows: Record<string, boolean>;
  selectedRows: ISubOrder[];
  onSelectedRowsChange: (rows: ISubOrder[]) => void;
  onMakeSignatureRequired?: () => void;
  onRemoveSignatureRequired?: () => void;
  pendingVerificationCount?: number;
  onVerifyAddress?: (item: ISubOrder) => void;
  onVerifyAllPending?: () => void;
}

const OrderInformation: React.FC<Props> = ({
  order,
  canUpdateSignature,
  selectedExternalRows,
  selectedRows,
  onSelectedRowsChange,
  onMakeSignatureRequired,
  onRemoveSignatureRequired,
  pendingVerificationCount,
  onVerifyAddress,
  onVerifyAllPending,
}) => {
  return (
    <Tabs defaultValue="information" className="w-full">
      <TabsList className="border-b border-gray-200 w-full justify-start rounded-none bg-transparent p-0 h-auto">
        <TabsTrigger value="information" className="rounded-none">
          Order information
        </TabsTrigger>
        <TabsTrigger value="updates" className="rounded-none">
          Order updates
        </TabsTrigger>
      </TabsList>
      <TabsContent value="information">
        <OrderInformationTable
          order={order}
          canUpdateSignature={canUpdateSignature}
          selectedExternalRows={selectedExternalRows}
          selectedRows={selectedRows}
          onSelectedRowsChange={onSelectedRowsChange}
          onMakeSignatureRequired={onMakeSignatureRequired}
          onRemoveSignatureRequired={onRemoveSignatureRequired}
          pendingVerificationCount={pendingVerificationCount}
          onVerifyAddress={onVerifyAddress}
          onVerifyAllPending={onVerifyAllPending}
        />
      </TabsContent>
      <TabsContent value="updates">
        <OrderUpdates order={order} />
      </TabsContent>
    </Tabs>
  );
};

export default OrderInformation;
