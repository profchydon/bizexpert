import { useState } from "react";
import OrderFilter from "./OrderFilter";
import config from "@/config/config";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import displayErrorMessage from "@/utils/displayErrorMessage";

interface FilterParams {
  type?: string | null;
  search?: string | null;
  country?: string | null;
  page?: number;
  per_page?: number;
}

export const ExportOrder = () => {
  const { getAuthToken } = useAuthUserDetail();
  const userToken = getAuthToken();
  const companyId = useWorkspaceCompanyId();

  const [isExportLoading, setIsExportLoading] = useState(false);

  const handleExport = async (newParams: FilterParams) => {
    if (!companyId) return;

    setIsExportLoading(true);
    const params = {
      ...newParams,
    };

    const filteredParams = Object.fromEntries(
      Object.entries(params)?.filter(
        ([_, value]) => value !== "" && value !== undefined,
      ),
    );

    const queryString = new URLSearchParams(filteredParams as any)?.toString();
    const handeQueryString = () => {
      if (queryString) {
        return `${config.API_URL}/companies/${companyId}/orders/?${queryString}&download=true`;
      } else {
        return `${config.API_URL}/companies/${companyId}/orders/?download=true`;
      }
    };

    try {
      const response = await fetch(`${handeQueryString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "text/csv",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!response.ok) {
        setIsExportLoading(false);
        displayErrorMessage("Unable to generate CSV for specified filters.");
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "Rayda_Order_Filter.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
      setIsExportLoading(false);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <>
      <OrderFilter
        actionBtn="Export Data"
        handleApply={handleExport}
        isExportBtn={true}
        isExportLoading={isExportLoading}
        title="Export Data - Filter"
        description="Apply filters to export order data."
      />
    </>
  );
};
