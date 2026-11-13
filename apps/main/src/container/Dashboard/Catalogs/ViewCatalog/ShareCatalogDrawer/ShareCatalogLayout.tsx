"use client";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FC, useState } from "react";
import ShareEmailCatalog from "./ShareViaEmail";
import SelectEmployeeCatalog from "./SelectEmployeeCatalog";
import { ICatalog } from "@/types/catalog";

interface Props {
  onClose: () => void;
  catalog?: ICatalog;
}
const ShareCatalogLayout: FC<Props> = ({ onClose, catalog }) => {
  const [tabState, setTabState] = useState("employee");
  return (
    <>
      <Tabs
        defaultValue="employee"
        onValueChange={(value) => setTabState(value)}
        value={tabState}
      >
        <TabsList className="flex justify-normal p-6">
          <TabsTrigger
            value="employee"
            className="font-semibold text-sm hover:bg-primary-25"
          >
            Select employee
          </TabsTrigger>
          {/* <TabsTrigger
            value="email"
            className="font-semibold text-sm  hover:bg-primary-25"
          >
            Share through email
          </TabsTrigger> */}
        </TabsList>

        <Separator className="border-gray-200 my-4 border" />

        <TabsContent value="employee" className="pt-0 ">
          <SelectEmployeeCatalog catalog={catalog} onClose={onClose} />
        </TabsContent>

        <TabsContent value="email" className=" pt-0 ">
          <ShareEmailCatalog catalog={catalog} onClose={onClose} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ShareCatalogLayout;
