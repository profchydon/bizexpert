"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Featuredicon from "@/assets/icons/Featured icon (8).svg";
import Image from "next/image";
import { DialogDescription } from "@radix-ui/react-dialog";
import { ILevel } from "@/types/departments";
import { showApiError } from "@/utils/showApiError";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useDeleteLevelMutation } from "@/api/baseQueries/companiesApi/levelsApi/deleteLevel";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

interface Props {
  onClose: () => void;
  isOpen: boolean;
  levelDetail?: ILevel;
}

const DeleteLevelModal: React.FC<Props> = ({
  isOpen,
  onClose,
  levelDetail,
}) => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();
  const [deleteLevel, deleteLevelProps] = useDeleteLevelMutation();

  const handleDeleteLevel = async () => {
    await deleteLevel({
      companyId: companyId!,
      levelId: levelDetail?.id!,
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
        data-testid="deletelevelmodal-dialog"
      >
        <DialogContent className="md:min-w-[400px] w-[calc(100%-30px)] overflow-y-auto">
          <DialogHeader className="items-center pt-20">
            <Image src={Featuredicon} alt="" />
          </DialogHeader>
          <DialogDescription>
            <p className="text-center text-lg font-IBM Plex Sans font-semibold text-[#101828]">
              Delete <strong>{levelDetail?.name}</strong> level?
            </p>
            <p className="text-center text-sm font-normal">
              This level has ({levelDetail?.member_count}) members.
            </p>
          </DialogDescription>

          <div className="flex gap-x-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onClose()}
              data-testid="deletelevelmodal-button"
            >
              Cancel
            </Button>
            <Button
              className="w-full"
              disabled={deleteLevelProps.isLoading}
              onClick={handleDeleteLevel}
              data-testid="deletelevelmodal-button-2"
            >
              Yes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteLevelModal;
