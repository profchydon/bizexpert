import DrawerRight from "@/components/DrawerRight";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddAdmins from "./AddAdmins";
import AddNewEmployee from "./AddNewEmployee";
import SendInvite from "./SendInvite";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}
const AddEmployee: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectEmployees, setSelectEmployees] = useState<string[]>([]);
  const [tab, setTab] = useState("add-admin");

  return (
    <DrawerRight
      isOpen={isOpen}
      onCancel={onClose}
      onClose={onClose}
      drawerDescription="Please select employees you want add to admin"
      drawerTitle="Add admin"
      onSave={() => null}
      hideDefaultFooterBtn
      data-testid="addemployee-drawerright"
    >
      <Tabs
        defaultValue="add-admin"
        value={tab}
        onValueChange={(value) => setTab(value)}
      >
        <TabsList>
          <TabsTrigger value="add-admin">Select employees</TabsTrigger>
          {/* <TabsTrigger value="add-employee">Add employee</TabsTrigger> */}
          <TabsTrigger value="invite">Send invites</TabsTrigger>
        </TabsList>

        <TabsContent value="add-admin" className="mt-6">
          <AddAdmins
            onClose={onClose}
            selectEmployees={selectEmployees}
            setSelectEmployees={(value) => setSelectEmployees(value)}
          />
        </TabsContent>

        {/* <TabsContent value="add-employee" className="mt-6">
          <AddNewEmployee onClose={onClose} />
        </TabsContent> */}

        <TabsContent value="invite" className="mt-6">
          <SendInvite onClose={onClose} />
        </TabsContent>
      </Tabs>
    </DrawerRight>
  );
};

export default AddEmployee;
