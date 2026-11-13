import React, { useMemo, useState } from "react";
import { z } from "zod";
import { subscriptionSchema } from "./schema";
import { mockData } from "./mockData";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import SubscriptionTableActions from "./tableActions";
import SubscriptionTableColumn from "./tableColumns";
import { LuDownload } from "react-icons/lu";

function getSubscription() {
  return z.array(subscriptionSchema).parse(mockData);
}

const SubscriptionTable = () => {
  const subscription = getSubscription();

  const columns: any = useMemo(
    () =>
      SubscriptionTableColumn((item: Record<string, string>) => (
        <SubscriptionTableActions item={item} onDownload={() => {}} />
      )),
    [],
  );
  return (
    <div>
      <Card>
        <CardHeader className="p-2 border-b border-border-secondary flex flex-row items-center justify-between">
          <div className="flex flex-col">
            <p className="text-gray-900 text-lg font-semibold">
              Billing and invoicing
            </p>
            <p className="text-sm text-gray-600">
              Pick an account plan that fits your workflow.
            </p>
          </div>
          <Button
            variant="outline"
            size="md"
            data-testid="subscriptiontable-button"
          >
            <LuDownload className="mr-1" />
            Download All
          </Button>
        </CardHeader>
        <CardContent className="px-0 pt-0 pb-2">
          <DataTable
            data={subscription}
            columns={columns}
            pagination={{
              currentPage: 1,
              lastPage: 3,
              onPageChange: () => null,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionTable;
