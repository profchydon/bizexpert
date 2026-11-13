import React, { FC } from "react";
import DrawerRight from "@/components/DrawerRight";
import ShareCatalogLayout from "./ShareCatalogLayout";
import { ICatalog } from "@/types/catalog";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  catalog?: ICatalog;
}
const ShareCatalogDrawer: FC<Props> = ({ isOpen, onClose, catalog }) => {
  return (
    <DrawerRight
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      saveText="Submit"
      drawerTitle="Share Catalog"
      drawerDescription="Share this catalog with employees"
      hideDefaultFooterBtn
      data-testid="sharecatalogdrawer-drawerright"
    >
      <ShareCatalogLayout catalog={catalog} onClose={onClose} />
    </DrawerRight>
  );
};

export default ShareCatalogDrawer;
