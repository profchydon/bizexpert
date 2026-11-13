"use client";

import PageHeader from "@/components/PageHeader";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const widgets = [
  {
    id: "web-widget",
    name: "Rayda Web Widget",
    desc: "View Rayda Website",
    link: "https://rayda.co",
  },
  {
    id: "marketplace",
    name: "Rayda Marketplace",
    desc: "Get access to all assets in marketplace",
    link: "https://www.remote-dev.rayda.co/dashboard/equip-employee",
  },
  {
    id: "calc",
    name: "Rayda Calculator",
    desc: "Quickly get estimation of storage costs",
    link: "https://rayda-price-calc.vercel.app/?type=Onboarding",
  },
];
const Widgets = () => {
  const router = useRouter();
  const [previewLink, setPreviewLink] = useState<string>();
  const [height, setHeight] = useState("500");
  const [width, setWidth] = useState("500");

  const [selectedWidget, setSelectedWidget] = useState<string>();

  const { getCompanyDetails } = useAuthUserDetail();

  const generateEmbedCode = () => {
    return `<iframe
  src="https://rayda.co"
  width="${width}"
  height="${height}"
  frameborder="0"
></iframe>`;
  };

  return (
    <div className="flex flex-col py-8">
      <PageHeader
        breadCrumbs={["Asset Vault"]}
        pageTitle="Widget Embedding"
        pageDescription="Add widget embedding"
        onBack={() => router.back()}
      ></PageHeader>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Card className="mt-6">
            <CardContent className="p-4">
              <div>
                <div className="text-lg font-medium">Select Widget</div>

                <div className="pt-4 flex flex-col gap-y-3">
                  {widgets.map((widg) => (
                    <div
                      className={cn(
                        "flex flex-col gap-y-1 border border-gray-300 rounded-md p-4 cursor-pointer",
                        selectedWidget === widg.id &&
                          "border-primary-600 bg-primary-50",
                      )}
                      onClick={() => {
                        setSelectedWidget(widg.id);
                        setPreviewLink(widg.link);
                      }}
                    >
                      <p
                        className={cn(
                          "font-medium text-base",
                          selectedWidget === widg.id && "text-black",
                        )}
                      >
                        {widg.name}
                      </p>
                      <span className="text-sm text-gray-600">{widg.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {previewLink && (
          <div>
            <Card className="mt-6">
              <CardContent className="p-4">
                <div className="text-lg font-medium mb-4">Customize</div>

                <div className="flex flex-col gap-y-4">
                  <div className="flex flex-col gap-y-2">
                    <Label>Height</Label>
                    <Input
                      value={height}
                      type="number"
                      onChange={(e) => setHeight(e.target.value)}
                      data-testid="widget-input"
                    />
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <Label>Width</Label>
                    <Input
                      value={width}
                      type="number"
                      onChange={(e) => setWidth(e.target.value)}
                      data-testid="widget-input-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardContent className="p-4">
                <div className="mb-4 flex justify-between items-center">
                  <div className="text-lg font-medium">Embed Code</div>
                  <div>
                    <Button
                      variant={"outline"}
                      className="text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300-500"
                      onClick={() =>
                        navigator.clipboard.writeText(generateEmbedCode())
                      }
                      data-testid="widget-button"
                    >
                      Copy
                    </Button>
                  </div>
                </div>

                <Textarea
                  className="w-full p-2 border rounded-md focus:ring focus:ring-primary-400-200"
                  rows={7}
                  readOnly
                  value={generateEmbedCode()}
                />
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardContent className="p-4">
                {!previewLink && (
                  <div className="text-lg font-medium mb-4 grid place-content-center p-12">
                    No Preview
                  </div>
                )}
                {previewLink && (
                  <div className="text-lg font-medium mb-4">Preview</div>
                )}

                {previewLink && (
                  <iframe
                    aria-label="Asset Offboarding Form"
                    width={width}
                    height={height}
                    src={previewLink}
                  ></iframe>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Widgets;
