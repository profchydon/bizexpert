import { useGenerateKeysMutation } from "@/api/baseQueries/companiesApi/credentialsAPi/generateKeys";
import { useGetKeysQuery } from "@/api/baseQueries/companiesApi/credentialsAPi/getKeys";
import { useViewSubscriptionQuery } from "@/api/baseQueries/companiesApi/subscriptionsApi/viewSubscription";
import PageState from "@/components/PageState";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import React, { useState } from "react";
import TestApiKeys from "./TestApiKeys";
import { useUpdateCredentialURLMutation } from "@/api/baseQueries/companiesApi/credentialsAPi/updateCredentialURL";
import LiveApiKeys from "./LiveApiKeys";
import LiveKeyEmptyInstance from "./LiveKeyEmptyInstance";
import TestKeyEmptyInstance from "./TestKeyEmptyInstance";
import NeedHelpWithIntegrations from "./NeedHelpWithIntegrations";
import { ICredentials } from "@/types/credential";
import TestApiKeysEmptyInstance from "./TestApiKeysEmptyInstance";
import McpCredentials from "./McpCredentials";
import CredentialSection from "./CredentialSection";
import { CircleAlert } from "lucide-react";

type Tabvalue = "test" | "live";
const ApiKeys = () => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const [tabValue, setTabValue] = useState<Tabvalue>("test");
  const [isTabLoad, setIsTabLoad] = useState(false);

  const handleTabChange = (newTabvalue: Tabvalue) => {
    setIsTabLoad(true);
    setTabValue(newTabvalue);
    setTimeout(() => setIsTabLoad(false), 1500);
  };

  const [generateKeys, { isLoading: isGeneratingKey }] =
    useGenerateKeysMutation();
  const {
    data: subscriptionRes,
    isLoading: isLoadingSub,
    isError: isErrorSub,
  } = useViewSubscriptionQuery({
    companyId: company?.id,
  });
  const subscription = subscriptionRes?.data!;
  const planName = subscription?.plan?.name as string;

  const {
    data: getKeysRes,
    isLoading: isLoadingGetKeys,
    isError: isErrorGetKeys,
  } = useGetKeysQuery(
    {
      companyId: company?.id as string,
      params: {
        environment: tabValue,
      },
    },
    {
      skip: !company?.id || !tabValue || planName !== "Scale",
      refetchOnMountOrArgChange: true,
    },
  );

  const keysList = Array.isArray(getKeysRes?.data) ? getKeysRes.data : [];

  const fetchKeyTestData =
    keysList.find((key: any) => key.environment === "test") ?? null;

  const fetchKeyLiveData =
    keysList.find((key: any) => key.environment === "live") ?? null;

  const [updateCredentialURL, { isLoading: isUpdatingCredentials }] =
    useUpdateCredentialURLMutation();

  const handleGenerateKey = async () => {
    await generateKeys({
      companyId: company?.id as string,
      environment: tabValue as string,
      callback_url: "" as string,
      webhook_url: "" as string,
      expires_at: "" as string,
    })
      .unwrap()
      .then(() => {
        if (tabValue !== "test") {
          return displaySuccessMessage(
            `Generate API key`,
            `Live key succesfully generated.`,
          );
        } else {
          return displaySuccessMessage(
            `Generate API key`,
            `Test key succesfully generated.`,
          );
        }
      });
  };

  const handleSaveChanges = async (
    callback_url: string,
    webhook_url: string,
  ) => {
    await updateCredentialURL({
      companyId: company?.id as string,
      environment: tabValue as string,
      callback_url,
      webhook_url,
    })
      .unwrap()
      .then(() => {
        if (tabValue !== "test") {
          return displaySuccessMessage(
            `Update credential URL`,
            `Live credential URL successfully updated`,
          );
        } else {
          return displaySuccessMessage(
            `Update credential URL`,
            `Test credential URL successfully updated`,
          );
        }
      });
  };

  return (
    <div className="pt-4 gap-y-8">
      <Tabs
        defaultValue="test"
        value={tabValue}
        onValueChange={(value) => handleTabChange(value as Tabvalue)}
        className="w-full"
      >
        <TabsList className="flex flex-col items-start mb-8">
          <div className="flex flex-row">
            <TabsTrigger value="test">Test</TabsTrigger>

            <TabsTrigger value="live" disabled={planName !== "Scale"}>
              Live
            </TabsTrigger>
          </div>
          <Separator />
        </TabsList>

        <TabsContent value="test" className="flex flex-col gap-6">
          <div className="flex flex-row space-x-3 items-end bg-error-25 border border-error-300 text-red-700 p-4 rounded-md">
            <div className="flex items-center self-start">
              <CircleAlert className="w-5 h-5 text-error-600" />
            </div>

            <div className="flex flex-col gap-y-2">
              <span className="leading-5 font-medium text-sm text-error-700">
                These keys are for testing only.
              </span>
              <p className="text-sm font-normal text-error-700">
                It is highly advised that you refrain from using them in a
                production environment, as doing so could lead to unforeseen
                issues and complications that may affect the overall performance
                and reliability of your system.
              </p>
            </div>
          </div>

          <PageState
            isLoading={isLoadingSub || isLoadingGetKeys || isTabLoad}
            isError={isErrorSub || isErrorGetKeys}
          >
            {planName !== "Scale" && (
              <>
                <TestKeyEmptyInstance planName={planName} />
              </>
            )}

            {planName === "Scale" && (
              <div className="flex flex-col gap-4">
                <CredentialSection
                  title="API keys"
                  description="Static secret keys for server-to-server requests."
                  defaultOpen
                >
                  {!fetchKeyTestData?.company_id ||
                  !fetchKeyTestData?.public_key ||
                  !fetchKeyTestData?.secret_key ? (
                    <TestApiKeysEmptyInstance
                      handleGenerate={handleGenerateKey}
                      isLoading={isGeneratingKey}
                    />
                  ) : (
                    <TestApiKeys
                      testKeyData={fetchKeyTestData}
                      handleGenerate={handleGenerateKey}
                      isLoadingKey={isGeneratingKey}
                      isSavingUrl={isUpdatingCredentials}
                      handleSave={handleSaveChanges}
                      tabValue={tabValue}
                    />
                  )}
                </CredentialSection>

                <CredentialSection
                  title="MCP credentials"
                  description="Client ID / secret pairs for the MCP connector (client_credentials grant)."
                >
                  <McpCredentials environment="test" />
                </CredentialSection>
              </div>
            )}
          </PageState>
        </TabsContent>

        <TabsContent value="live" className="flex flex-col gap-8">
          <PageState
            isLoading={isLoadingSub || isLoadingGetKeys || isTabLoad}
            isError={isErrorSub || isErrorGetKeys}
          >
            <div className="flex flex-col gap-4">
              <CredentialSection
                title="API keys"
                description="Static secret keys for server-to-server requests."
                defaultOpen
              >
                {!fetchKeyLiveData?.public_key ||
                !fetchKeyLiveData?.secret_key ? (
                  <LiveKeyEmptyInstance
                    handleGenerate={handleGenerateKey}
                    isLoading={isGeneratingKey}
                  />
                ) : (
                  <LiveApiKeys
                    liveKeyData={fetchKeyLiveData}
                    handleGenerate={handleGenerateKey}
                    isLoadingKey={isGeneratingKey}
                    handleSave={handleSaveChanges}
                    isSavingUrl={isUpdatingCredentials}
                    tabValue={tabValue}
                  />
                )}
              </CredentialSection>

              <CredentialSection
                title="MCP credentials"
                description="Client ID / secret pairs for the MCP connector (client_credentials grant)."
              >
                <McpCredentials environment="live" />
              </CredentialSection>
            </div>
          </PageState>
        </TabsContent>
      </Tabs>
      {planName === "Scale" ? <NeedHelpWithIntegrations /> : null}
    </div>
  );
};

export default ApiKeys;
