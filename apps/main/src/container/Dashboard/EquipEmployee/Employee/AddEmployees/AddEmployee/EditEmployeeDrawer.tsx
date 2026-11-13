"use client";

import DrawerRight from "@/components/DrawerRight";
import React from "react";
import AddEmployee from ".";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  employeepage_instance?: boolean;
  employeeViewpage_instance?: boolean;
}

const EditEmployeeDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  employeepage_instance = false,
  employeeViewpage_instance = false,
}) => {
  return (
    <DrawerRight
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      onSave={() => {}}
      drawerTitle="Edit employees"
      drawerDescription="Edit and Update Employee Details"
      width={"872"}
      hideDefaultFooterBtn
      className="px-0"
      data-testid="editemployeedrawer-drawerright"
    >
      {isOpen && (
        <AddEmployee
          isOpen={isOpen}
          onClose={onClose}
          edit_instance={true}
          next={() => {}}
          employeepage_instance={employeepage_instance}
          employeeViewpage_instance={employeeViewpage_instance}
        />
      )}
    </DrawerRight>
  );
};

export default EditEmployeeDrawer;
