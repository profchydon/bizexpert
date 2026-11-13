import React, { useState } from "react";
import { ICatalog } from "@/types/catalog";
import { useShareCatalogMutation } from "@/api/baseQueries/companiesApi/catalogsApi/shareCatalog";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { handleUnexpectedAsyncError } from "@/utils/handleUnexpectedAsyncError";
import TagsInput from "@/components/TagsInput";
import DrawerFooter from "@/components/DrawerRight/DrawerFooter";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

const ShareEmailCatalog: React.FC<{
  catalog?: ICatalog;
  onClose: () => void;
}> = ({ onClose, catalog }) => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();

  const [selectedValue, setSelectedValue] = useState<string[]>([]);
  const [shareCatalog, shareCatalogProps] = useShareCatalogMutation();

  const onSubmit = async () => {
    try {
      if (selectedValue.length > 0) {
        const res = await shareCatalog({
          companyId: companyId!,
          catalogId: catalog?.id!,
          emails: selectedValue,
        });
        const success = res.data?.success;
        if (success) {
          displaySuccessMessage("Users invited successfully");
          setSelectedValue([]);
          onClose();
        }
      }
    } catch (error) {
      handleUnexpectedAsyncError(error, "Unable to share catalog");
    }
  };

  return (
    <div>
      <div className="space-y-3 mt-8">
        <TagsInput
          setValues={(values) => setSelectedValue(values)}
          values={selectedValue}
        />
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Add all the employees you want to invite here.
        </div>
      </div>

      <DrawerFooter
        onClose={onClose}
        disableSubmitButton={
          shareCatalogProps.isLoading || selectedValue.length === 0
        }
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default ShareEmailCatalog;
