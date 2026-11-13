"use client";

import StorageRemoteGate from "@/container/Dashboard/Storage/StorageRemoteGate";
import OpenFleetAccessWrapper from "@/container/Dashboard/Storage/Remote/OpenFleetAccessWrapper";
import ImportPage from "@/container/Dashboard/Storage/Remote/import/ImportPage";

const StorageImportRoute = () => (
  <StorageRemoteGate>
    <OpenFleetAccessWrapper>
      <ImportPage />
    </OpenFleetAccessWrapper>
  </StorageRemoteGate>
);

export default StorageImportRoute;
