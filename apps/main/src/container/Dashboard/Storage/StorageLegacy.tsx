"use client";

import PageHeader from "@/components/PageHeader";
import PageState from "@/components/PageState";
import { Button } from "@/components/ui/button";
import { useGetInStorageEquipmentsQuery } from "@/api/baseQueries/companiesApi/equipmentsApi/getInStorageEquipments";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import routes from "@/routes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MetricDetails from "./MetricDetails";
import StorageSummaryTable from "./StorageSummaryTable";

const StorageLegacy = () => {
  const router = useRouter();
  const companyId = useWorkspaceCompanyId();

  const {
    data: storageEquipment,
    isError,
    isLoading,
  } = useGetInStorageEquipmentsQuery({
    companyId: companyId!,
  });
  const itemsInStorage = storageEquipment?.data.items_in_storage_count ?? 0;
  const storagelLocationCount =
    storageEquipment?.data.storage_location_count ?? 0;
  const equipments = storageEquipment?.data.items_in_storage_by_country ?? [];

  return (
    <div className="flex flex-col py-8">
      <PageHeader
        breadCrumbs={["Storage"]}
        pageTitle="Storage"
        pageDescription="Easily store, manage, and track your company's equipment."
        onBack={() => router.back()}
      >
        <div className="flex gap-3 md:self-end">
          <Link href={routes.OFFBOARDING}>
            <Button data-testid="storagelegacy-button">
              <span className="text-sm font-semibold">Store equipment</span>
            </Button>
          </Link>
        </div>
      </PageHeader>

      <PageState isLoading={isLoading} isError={isError}>
        <div className="mt-8 space-y-8">
          <MetricDetails
            itemsInStorage={itemsInStorage}
            storagelLocationCount={storagelLocationCount}
          />
          <StorageSummaryTable itemsInStorage={equipments ?? []} />
        </div>
      </PageState>
    </div>
  );
};

export default StorageLegacy;
