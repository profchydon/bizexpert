"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Featuredicon from "@/assets/icons/Featured icon (8).svg";
import Image from "next/image";
import { DialogDescription } from "@radix-ui/react-dialog";
import MoveMembersToDepartment from "./MoveMembersToDepartment";
import { IDepartment } from "@/types/departments";
import { useDeleteDepartmentMutation } from "@/api/baseQueries/companiesApi/departmentsApi/deleteDepartment";
import { showApiError } from "@/utils/showApiError";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

interface Props {
  onClose: () => void;
  isOpen: boolean;
  departmentDetail?: IDepartment;
  onDelete: () => void;
}

const DeleteDepartmentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  departmentDetail,
  onDelete,
}) => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();
  const [deleteDepartment, deleteDepartmentProps] =
    useDeleteDepartmentMutation();

  const handleDeleteDepartment = async () => {
    await deleteDepartment({
      companyId: companyId!,
      departmentId: departmentDetail?.id!,
    })
      .unwrap()
      .then((res) => {
        onClose();
      })
      .catch(showApiError);
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        onOpenChange={onClose}
        data-testid="deletedepartmentmodal-dialog"
      >
        <DialogContent className="md:min-w-[400px] w-[calc(100%-30px)] overflow-y-auto">
          <DialogHeader className="items-center pt-20">
            <Image src={Featuredicon} alt="" />
          </DialogHeader>
          <DialogDescription>
            <p className="text-center text-lg font-IBM Plex Sans font-semibold text-[#101828]">
              Move members to a new department?
            </p>
            <p className="text-center text-sm font-normal">
              Reassign members to a new department to delete
            </p>
          </DialogDescription>

          <div className="flex gap-x-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onClose()}
              data-testid="deletedepartmentmodal-button"
            >
              Cancel
            </Button>
            <Button
              className="w-full"
              disabled={deleteDepartmentProps.isLoading}
              onClick={() => {
                if (departmentDetail?.member_count !== 0) {
                  onDelete();
                } else {
                  handleDeleteDepartment();
                }
              }}
              data-testid="deletedepartmentmodal-button-2"
            >
              Yes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteDepartmentModal;
