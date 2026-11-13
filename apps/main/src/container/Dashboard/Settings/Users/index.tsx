import React, { useState } from "react";
import UsersTable from "./UsersTable/index";
import AddEmployee from "./AddEmployee";
import { JoinRequestAutoApprovalCard } from "./JoinRequestAutoApprovalCard";

const Users = () => {
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const toggleEmployeeDrawer = () => setIsAddEmployeeOpen(!isAddEmployeeOpen);

  return (
    <div className="flex flex-col gap-6">
      <JoinRequestAutoApprovalCard />
      <UsersTable onAddAdmin={toggleEmployeeDrawer} />
      <AddEmployee onClose={toggleEmployeeDrawer} isOpen={isAddEmployeeOpen} />
    </div>
  );
};

export default Users;
