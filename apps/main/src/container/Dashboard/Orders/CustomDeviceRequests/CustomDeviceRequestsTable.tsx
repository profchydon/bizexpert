import { useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import PageState from "@/components/PageState";
import { useCustomDeviceRequestsTable } from "./useCustomDeviceRequestsTable";
import CustomDeviceRequestsEmptyState from "./components/CustomDeviceRequestsEmptyState";
import CustomDeviceRequestsTableColumn from "./components/CustomDeviceRequestsTableColumn";
import CustomDeviceRequestsToolbar from "./components/CustomDeviceRequestsToolbar";
import RFQDetailsSidebar from "./components/RFQDetailsSidebar";

export default function CustomDeviceRequestsTable() {
  const state = useCustomDeviceRequestsTable();

  const columns = useMemo(
    () =>
      CustomDeviceRequestsTableColumn((item) => state.openRequestDetails(item)),
    [state.openRequestDetails],
  );

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="p-0 border-b-0">
          <CustomDeviceRequestsToolbar
            activeFilter={state.activeFilter}
            activeFilterCount={state.activeFilterCount}
            assetTypes={state.availableAssetTypes}
            budgetRangeLimits={state.budgetRangeLimits}
            countries={state.availableCountries}
            filters={state.filters}
            onFilterChange={state.setActiveFilter}
            onSearchChange={state.setSearchQuery}
            onToggleFilters={() =>
              state.setShowFilterModal(!state.showFilterModal)
            }
            resultCount={state.totalResults}
            searchQuery={state.searchQuery}
            setFilters={state.setFilters}
            showFilterModal={state.showFilterModal}
          />
        </CardHeader>

        <PageState isLoading={state.isLoading} isError={false}>
          <CardContent className="px-0 pt-0 pb-2">
            <DataTable
              data={state.paginatedRequests}
              columns={columns}
              pagination={{
                currentPage: state.currentPage,
                lastPage: state.totalPages,
                onPageChange: state.setCurrentPage,
              }}
            >
              <CustomDeviceRequestsEmptyState
                onClear={state.resetFilters}
                searchQuery={state.searchQuery}
              />
            </DataTable>
          </CardContent>
        </PageState>
      </Card>

      {state.selectedRequest && (
        <RFQDetailsSidebar
          key={state.selectedRequest.id}
          isLoadingDetails={state.isRequestDetailsLoading}
          request={state.selectedRequest}
          isOpen={state.isSidebarOpen}
          onClose={state.closeRequestDetails}
          onAccept={state.handleAcceptQuote}
          onDecline={state.handleDeclineQuote}
        />
      )}
    </>
  );
}
