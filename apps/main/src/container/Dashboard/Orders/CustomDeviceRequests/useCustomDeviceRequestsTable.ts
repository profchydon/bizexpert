import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { useGetRfqQuery } from "@/api/baseQueries/companiesApi/rfqsApi/getRfq";
import { useGetRfqsQuery } from "@/api/baseQueries/companiesApi/rfqsApi/getRfqs";
import { useGetAssetTypesQuery } from "@/api/baseQueries/assetsApi/getAssetTypes";
import type {
  RfqListFilters,
  RfqRecord,
} from "@/api/baseQueries/companiesApi/rfqsApi/types";
import { useAcceptRfqQuoteMutation } from "@/api/baseQueries/companiesApi/rfqsApi/acceptRfqQuote";
import { useRejectRfqQuoteMutation } from "@/api/baseQueries/companiesApi/rfqsApi/rejectRfqQuote";
import { useLazyGetCartsQuery } from "@/api/baseQueries/cartApi/getCarts";
import { useTablePageQuery } from "@/hooks/useTablePageQuery";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import displayErrorMessage from "@/utils/displayErrorMessage";
import { emitCartOverviewOpen } from "@/hooks/cartEvents";
import { defaultRequestFilters, ITEMS_PER_PAGE } from "./constants";
import type {
  CustomDeviceRequest,
  FilterAssetTypeOption,
  FilterCountryOption,
  FilterTab,
  RequestFilters,
  SortDirection,
  SortField,
} from "./types";
import { mapRfqToCustomDeviceRequest } from "./apiMapper";
import { buildAssetTypeOptions } from "./assetTypeOptions";
import { canActOnRfqQuote } from "./rfqExpiration";
import { calculateBudgetTotal } from "./utils";
import displaySuccessMessage from "@/utils/displaySuccessMessage";

export function useCustomDeviceRequestsTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { getUserDetails } = useAuthUserDetail();
  const companyId = useWorkspaceCompanyId();
  const user = getUserDetails();
  const deepLinkRfqId = searchParams.get("rfq_id");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const { page: currentPage, setPage: setCurrentPage } = useTablePageQuery();
  const [selectedRequest, setSelectedRequest] =
    useState<CustomDeviceRequest | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<RequestFilters>(defaultRequestFilters);
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [acceptRfqQuote] = useAcceptRfqQuoteMutation();
  const [rejectRfqQuote] = useRejectRfqQuoteMutation();
  const [getCarts] = useLazyGetCartsQuery();
  const { data: assetTypesResponse } = useGetAssetTypesQuery();
  const assetTypeNames = useMemo(
    () =>
      new Map(
        (assetTypesResponse?.data ?? []).map((assetType) => [
          assetType.id,
          assetType.name,
        ]),
      ),
    [assetTypesResponse?.data],
  );

  let serverStatus: string | undefined;

  if (activeFilter === "all") {
    serverStatus = undefined;
  } else if (activeFilter === "confirmed") {
    serverStatus = "accepted";
  } else {
    serverStatus = activeFilter;
  }

  const rfqParams = useMemo(
    () => ({
      asset_type:
        filters.assetTypes.length > 0
          ? filters.assetTypes.join(",")
          : undefined,
      country_id:
        filters.countries.length > 0 ? filters.countries.join(",") : undefined,
      page: currentPage,
      per_page: ITEMS_PER_PAGE,
      search: debouncedSearchQuery || undefined,
      status: serverStatus,
    }),
    [
      currentPage,
      debouncedSearchQuery,
      filters.assetTypes,
      filters.countries,
      serverStatus,
    ],
  );

  const {
    data: rfqsResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetRfqsQuery({
    companyId: companyId,
    params: rfqParams,
  });

  const rawRfqRecords = useMemo((): RfqRecord[] => {
    const responseData = rfqsResponse?.data;

    if (!responseData) {
      return [];
    }

    if (Array.isArray(responseData)) {
      return responseData;
    }

    if ("rfqs" in responseData && Array.isArray(responseData.rfqs)) {
      return responseData.rfqs;
    }

    return [];
  }, [rfqsResponse?.data]);

  const responseCurrentPage = useMemo(() => {
    const responseData = rfqsResponse?.data;

    if (!responseData || Array.isArray(responseData)) {
      return null;
    }

    return responseData.current_page ?? 1;
  }, [rfqsResponse?.data]);

  const responseLastPage = useMemo(() => {
    const responseData = rfqsResponse?.data;

    if (!responseData || Array.isArray(responseData)) {
      return 1;
    }

    return responseData.last_page ?? 1;
  }, [rfqsResponse?.data]);

  const responseTotal = useMemo(() => {
    const responseData = rfqsResponse?.data;

    if (!responseData) {
      return 0;
    }

    if (Array.isArray(responseData)) {
      return responseData.length;
    }

    return responseData.total ?? 0;
  }, [rfqsResponse?.data]);

  const responseFilters = useMemo<RfqListFilters | undefined>(() => {
    const responseData = rfqsResponse?.data;

    if (!responseData || Array.isArray(responseData)) {
      return undefined;
    }

    return responseData.filters;
  }, [rfqsResponse?.data]);

  const requests = useMemo(
    () =>
      rawRfqRecords.map((rfq) =>
        mapRfqToCustomDeviceRequest(rfq, assetTypeNames),
      ),
    [assetTypeNames, rawRfqRecords],
  );

  const {
    data: rfqDetailResponse,
    isLoading: isLoadingRfqDetails,
    isFetching: isFetchingRfqDetails,
  } = useGetRfqQuery(
    {
      companyId: companyId,
      rfqId: selectedRequest?.rfqId,
      params: debouncedSearchQuery
        ? { search: debouncedSearchQuery }
        : undefined,
    },
    { skip: !companyId || !selectedRequest?.rfqId },
  );

  const hasMatchingDetails =
    rfqDetailResponse?.data?.id === selectedRequest?.rfqId;

  const selectedRequestDetails = useMemo(
    () =>
      hasMatchingDetails && rfqDetailResponse?.data
        ? mapRfqToCustomDeviceRequest(rfqDetailResponse.data, assetTypeNames)
        : selectedRequest,
    [
      assetTypeNames,
      hasMatchingDetails,
      rfqDetailResponse?.data,
      selectedRequest,
    ],
  );

  const isRequestDetailsLoading =
    Boolean(selectedRequest?.rfqId) &&
    (isLoadingRfqDetails || isFetchingRfqDetails || !hasMatchingDetails);

  const updateUrlRfqId = (rfqId?: string) => {
    const params = new URLSearchParams(
      rfqId || typeof window === "undefined"
        ? searchParams.toString()
        : window.location.search,
    );

    if (rfqId) {
      params.set("tab", "rfqs");
      params.set("rfq_id", rfqId);
    } else {
      params.delete("rfq_id");
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(
    () => () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!deepLinkRfqId) {
      return;
    }

    if (selectedRequest?.rfqId === deepLinkRfqId) {
      setIsSidebarOpen(true);
      return;
    }

    const matchedRequest = requests.find(
      (request) => request.rfqId === deepLinkRfqId,
    );

    if (matchedRequest) {
      setSelectedRequest(matchedRequest);
      setIsSidebarOpen(true);
      return;
    }

    setSelectedRequest((previous) => {
      if (previous?.rfqId === deepLinkRfqId) {
        return previous;
      }

      return {
        rfqId: deepLinkRfqId,
        id: "",
        devices: [],
        requestBudget: 0,
        country: "",
        status: "pending",
      };
    });
    setIsSidebarOpen(true);
  }, [deepLinkRfqId, requests, selectedRequest?.rfqId]);

  const filteredRequests = useMemo(
    () =>
      requests.filter((request) => {
        const budgetResult = calculateBudgetTotal(request);
        return (
          !budgetResult ||
          (budgetResult.total >= filters.budgetRange[0] &&
            budgetResult.total <= filters.budgetRange[1])
        );
      }),
    [filters.budgetRange, requests],
  );

  const budgetRangeLimits = useMemo<[number, number]>(() => {
    const min = Number(responseFilters?.budget_range?.min);
    const max = Number(responseFilters?.budget_range?.max);

    if (Number.isFinite(min) && Number.isFinite(max) && min <= max) {
      return [min, max];
    }

    return defaultRequestFilters.budgetRange;
  }, [responseFilters?.budget_range?.max, responseFilters?.budget_range?.min]);

  useEffect(() => {
    setFilters((previous) => {
      const isInitialBudgetRange =
        previous.budgetRange[0] === defaultRequestFilters.budgetRange[0] &&
        previous.budgetRange[1] === defaultRequestFilters.budgetRange[1];

      const nextBudgetRange: [number, number] = isInitialBudgetRange
        ? budgetRangeLimits
        : [
            Math.max(previous.budgetRange[0], budgetRangeLimits[0]),
            Math.min(previous.budgetRange[1], budgetRangeLimits[1]),
          ];

      if (nextBudgetRange[0] > nextBudgetRange[1]) {
        nextBudgetRange[0] = budgetRangeLimits[0];
        nextBudgetRange[1] = budgetRangeLimits[1];
      }

      if (
        previous.budgetRange[0] === nextBudgetRange[0] &&
        previous.budgetRange[1] === nextBudgetRange[1]
      ) {
        return previous;
      }

      return {
        ...previous,
        budgetRange: nextBudgetRange,
      };
    });
  }, [budgetRangeLimits]);

  const availableCountries = useMemo<FilterCountryOption[]>(() => {
    const countriesFromResponse = responseFilters?.countries ?? [];

    if (countriesFromResponse.length > 0) {
      return countriesFromResponse
        .map((country) => ({
          id: country.id,
          name: country.name,
          code: country.code,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    }

    return Array.from(
      new Map(
        rawRfqRecords.map((rfq) => [
          rfq.country.id,
          {
            id: rfq.country.id,
            name: rfq.country.name,
            code: rfq.country.code,
          },
        ]),
      ).values(),
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [rawRfqRecords, responseFilters?.countries]);

  const availableAssetTypes = useMemo<FilterAssetTypeOption[]>(() => {
    const responseAssetTypes = responseFilters?.asset_types ?? [];

    const rawAssetTypes =
      responseAssetTypes.length > 0
        ? responseAssetTypes
        : Array.from(
            new Set(
              requests.flatMap((request) =>
                request.devices.map((device) => device.assetType),
              ),
            ),
          );

    return buildAssetTypeOptions(rawAssetTypes, assetTypeNames);
  }, [assetTypeNames, requests, responseFilters?.asset_types]);

  const sortedRequests = useMemo(
    () =>
      [...filteredRequests].sort((first, second) => {
        if (!sortField) return 0;

        const getValue = (request: CustomDeviceRequest) =>
          sortField === "budget"
            ? (calculateBudgetTotal(request)?.total ?? 0)
            : request[sortField];

        const firstValue = getValue(first);
        const secondValue = getValue(second);

        if (firstValue < secondValue) return sortDirection === "asc" ? -1 : 1;
        if (firstValue > secondValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      }),
    [filteredRequests, sortDirection, sortField],
  );

  useEffect(() => {
    if (responseCurrentPage == null || responseCurrentPage === currentPage) {
      return;
    }
    setCurrentPage(responseCurrentPage);
  }, [currentPage, responseCurrentPage, setCurrentPage]);

  const activeFilterCount =
    filters.countries.length +
    filters.assetTypes.length +
    (filters.budgetRange[0] > budgetRangeLimits[0] ||
    filters.budgetRange[1] < budgetRangeLimits[1]
      ? 1
      : 0);

  const setFilterTab = (value: FilterTab) => {
    setActiveFilter(value);
    setCurrentPage(1);
  };

  const updateFilters = (value: RequestFilters) => {
    setFilters(value);
    setCurrentPage(1);
  };

  const updateSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const closeRequestDetails = () => {
    setIsSidebarOpen(false);
    updateUrlRfqId();

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    closeTimeoutRef.current = setTimeout(() => {
      setSelectedRequest(null);
      closeTimeoutRef.current = null;
    }, 220);
  };

  const handleAcceptQuote = async (
    request: CustomDeviceRequest,
    selectedDeviceIds: string[],
  ): Promise<boolean> => {
    if (!companyId || !request.responseId) return false;

    if (!canActOnRfqQuote(request)) {
      displayErrorMessage(
        "This quote has expired. Please submit a new request.",
      );
      return false;
    }

    if (selectedDeviceIds.length === 0) {
      displayErrorMessage(
        "Unable to accept quote. Please select at least one quoted item.",
      );
      return false;
    }

    try {
      await acceptRfqQuote({
        companyId: companyId!,
        rfqId: request.rfqId,
        rfqResponseId: request.responseId,
        deviceIds: selectedDeviceIds,
      }).unwrap();

      if (user?.id && companyId) {
        await getCarts({ companyId, userId: user.id }).unwrap();
      }

      closeRequestDetails();
      displaySuccessMessage(
        "RFQ items added to cart",
        "Your quoted RFQ items are now in your cart and ready to order.",
      );
      emitCartOverviewOpen();
      refetch();
      return true;
    } catch {
      displayErrorMessage("Unable to accept quote. Please try again.");
      return false;
    }
  };

  const handleDeclineQuote = async (
    request: CustomDeviceRequest,
    clientRejectionReason?: string,
  ): Promise<boolean> => {
    if (!companyId || !request.responseId) return false;

    try {
      await rejectRfqQuote({
        companyId: companyId!,
        rfqId: request.rfqId,
        rfqResponseId: request.responseId,
        clientRejectionReason,
      }).unwrap();

      displaySuccessMessage(
        "Quote Rejected",
        "You have rejected this quote. You can submit a new request if needed.",
      );
      refetch();
      return true;
    } catch {
      displayErrorMessage("Unable to reject quote. Please try again.");
      return false;
    }
  };

  const openRequestDetails = (request: CustomDeviceRequest) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    setSelectedRequest(request);
    setIsSidebarOpen(true);
    updateUrlRfqId(request.rfqId);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilters({
      countries: [],
      assetTypes: [],
      budgetRange: budgetRangeLimits,
    });
    setActiveFilter("all");
    setCurrentPage(1);
  };

  return {
    activeFilter,
    activeFilterCount,
    currentPage,
    filters,
    handleAcceptQuote,
    handleDeclineQuote,
    isSidebarOpen,
    isLoading: isLoading || isFetching,
    mounted,
    openRequestDetails,
    paginatedRequests: sortedRequests,
    resetFilters,
    searchQuery,
    selectedRequest: selectedRequestDetails,
    closeRequestDetails,
    setActiveFilter: setFilterTab,
    setCurrentPage,
    setFilters: updateFilters,
    setSearchQuery: updateSearch,
    setShowFilterModal,
    setSortDirection,
    setSortField,
    showFilterModal,
    sortDirection,
    sortField,
    budgetRangeLimits,
    availableAssetTypes,
    availableCountries,
    totalPages: responseLastPage,
    totalResults: responseTotal,
    isRequestDetailsLoading,
  };
}
