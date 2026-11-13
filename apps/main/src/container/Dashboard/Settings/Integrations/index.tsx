import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import React, { useEffect } from "react";
import { useResetTablePage } from "@/hooks/useResetTablePage";
import { useTablePageQuery } from "@/hooks/useTablePageQuery";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import All from "./All";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import { useGetIntegrationsQuery } from "@/api/baseQueries/companiesApi/integrationsApi/getIntegrations";
import { I_Integration, I_LiveIntegrations } from "@/types/integrations";
import LiveIntegration from "./LiveIntegration";
import PageState from "@/components/PageState";
import { useRouter, useSearchParams } from "next/navigation";
import {
  INTEGRATION_CATEGORY_TABS,
  isHiddenIntegrationCategoryId,
} from "./integrationCategories";
import {
  buildIntegrationsSettingsPath,
  parseIntegrationCategory,
  parseIntegrationView,
  type IntegrationView,
} from "./integrationsSearchParams";
import { useFinchSettingsCodeExchange } from "./useFinchSettingsCodeExchange";

const Integrations = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCategory = searchParams.get("category");
  const category = parseIntegrationCategory(rawCategory);
  const integrationView = parseIntegrationView(
    searchParams.get("integrationView"),
  );
  const entity = searchParams.get("entity");

  useEffect(() => {
    if (!isHiddenIntegrationCategoryId(rawCategory)) {
      return;
    }
    router.replace(
      buildIntegrationsSettingsPath({
        category,
        view: integrationView,
        extra: { entity },
      }),
    );
  }, [category, entity, integrationView, rawCategory, router]);

  const companyId = useWorkspaceCompanyId();

  const { page, setPage } = useTablePageQuery("integrations_page");
  useResetTablePage(setPage, category);

  const {
    data: getIntegrations,
    isLoading: isLoading_getInt,
    isFetching: isFetching_getInit,
    isError: getInit_error,
  } = useGetIntegrationsQuery(
    {
      companyId: companyId!,
      params: { page: page, category },
    },
    { skip: !companyId },
  );

  const { isLoading_verifyFinch, isFetching_verifyFinch, verifyFinch_error } =
    useFinchSettingsCodeExchange(companyId);

  const integrationsData = getIntegrations?.data?.integrations
    ?.data as I_Integration[];

  const currentPage = getIntegrations?.data?.integrations?.current_page ?? 1;
  const lastPage = getIntegrations?.data?.integrations?.last_page ?? 1;

  const live_integrations = getIntegrations?.data
    ?.live_integrations as I_LiveIntegrations[];

  const isLoading =
    isLoading_getInt ||
    isFetching_getInit ||
    isLoading_verifyFinch ||
    isFetching_verifyFinch;
  const isError = getInit_error || verifyFinch_error;

  const setCategory = (next: string) => {
    router.replace(
      buildIntegrationsSettingsPath({
        category: parseIntegrationCategory(next),
        view: integrationView,
        extra: { entity },
      }),
    );
  };

  const setView = (next: string) => {
    router.replace(
      buildIntegrationsSettingsPath({
        category,
        view: next as IntegrationView,
        extra: { entity },
      }),
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Tabs value={category} onValueChange={setCategory} className="w-full">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-6 rounded-none border-b border-gray-200 bg-transparent p-0">
          {INTEGRATION_CATEGORY_TABS.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-1 pb-3 pt-2 text-sm font-semibold text-gray-500 hover:text-gray-700 data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 data-[state=active]:shadow-none"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Tabs value={integrationView} onValueChange={setView} className="w-full">
        <TabsList className="flex h-auto w-full justify-start gap-6 rounded-none border-b border-gray-200 bg-transparent p-0">
          <TabsTrigger
            value="all"
            className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-1 pb-3 pt-2 text-sm font-semibold text-gray-500 hover:text-gray-700 data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 data-[state=active]:shadow-none"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="live"
            className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-1 pb-3 pt-2 text-sm font-semibold text-gray-500 hover:text-gray-700 data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 data-[state=active]:shadow-none"
          >
            Live
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <PageState isLoading={isLoading} isError={isError}>
            <All
              integrationsData={integrationsData}
              companyId={companyId as string}
              isLoading={isLoading}
              isError={isError}
              liveData={live_integrations}
              currentPage={currentPage}
              lastPage={lastPage}
              setPage={setPage}
            />
          </PageState>
        </TabsContent>

        <TabsContent value="live" className="mt-6">
          <>
            {live_integrations?.length < 1 ? (
              <EmptyTableInstance
                description="Setup an integration to continue."
                title="No live integrations yet"
              />
            ) : (
              <PageState isLoading={isLoading} isError={isError}>
                <LiveIntegration
                  companyId={companyId as string}
                  isLoading={isLoading}
                  isError={isError}
                  liveData={live_integrations}
                />
              </PageState>
            )}
          </>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Integrations;
