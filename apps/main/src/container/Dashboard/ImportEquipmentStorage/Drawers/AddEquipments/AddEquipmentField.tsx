"use client";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FC, useState } from "react";
import UploadEquipments from "./ImportLayout";
import SingleLayout from "./SingleLayout";

interface Props {
  onClose: () => void;
}
const AddEquipmentField: FC<Props> = ({ onClose }) => {
  const [tabState, setTabState] = useState("import");
  return (
    <>
      <Tabs
        defaultValue="import"
        onValueChange={(value) => setTabState(value)}
        value={tabState}
      >
        <TabsList className="flex justify-start p-6 max-[345px]:justify-center">
          <TabsTrigger value="import" className="font-semibold text-sm ">
            Import equipment
          </TabsTrigger>
          <TabsTrigger value="add" className="font-semibold text-sm ">
            Add equipment
          </TabsTrigger>
        </TabsList>

        <Separator className="border-gray-200 my-4 border" />

        <TabsContent value="import" className="pt-0">
          <UploadEquipments onClose={onClose} />
        </TabsContent>

        <TabsContent value="add" className=" pt-0">
          <SingleLayout onClose={onClose} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default AddEquipmentField;
