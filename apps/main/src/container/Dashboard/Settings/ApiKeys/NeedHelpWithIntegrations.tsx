import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { openSafeRedirectUrl } from "@/utils/auth/isSafeRedirectUrl";
import displayErrorMessage from "@/utils/displayErrorMessage";
import { INTEGRATION_DOCS_URL } from "./integrationDocsUrl";

const NeedHelpWithIntegrations = () => {
  return (
    <Card className="mt-4">
      <CardContent className="flex flex-col gap-y-6 p-4">
        <div className="flex flex-col gap-y-1">
          <p className="font-semibold text-lg text-gray-900">
            Need help with your integration?
          </p>
          <p className="font-normal text-sm text-gray-600">
            Be sure to check out our comprehensive API documentation, which
            provides detailed information, guidelines, and best practices for
            effectively utilizing our services. You'll find in-depth
            explanations, code examples, and troubleshooting tips that will help
            you navigate through the integration process with ease.
          </p>
        </div>
        <Button
          className="text-sm font-semibold max-w-[9.875rem]"
          onClick={() => {
            if (!openSafeRedirectUrl(INTEGRATION_DOCS_URL)) {
              displayErrorMessage(
                "We couldn't open the documentation.",
                "The documentation address was not a valid http or https URL.",
              );
            }
          }}
          data-testid="needhelpwithintegrations-button"
        >
          See documentation
        </Button>
      </CardContent>
    </Card>
  );
};

export default NeedHelpWithIntegrations;
