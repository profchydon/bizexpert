import EmptyTableInstance from "@/components/EmptyTableInstance";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React from "react";
import dummyImage from "@/assets/images/Image.svg";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import routes from "@/routes";
import { IEquipment } from "@/types/equipments";
import { Badge } from "@/components/ui/badge";

const Assets: React.FC<{ assets: IEquipment[] }> = ({ assets }) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg text-gray-900 font-semibold">Assets</h2>
          <span className="text-sm">Your recent assets here</span>
        </div>
        <Link href={routes.EMPLOYEE_ASSETS}>
          <Button data-testid="assets-button">All assets</Button>
        </Link>
      </div>

      {assets.length > 0 && (
        <div>
          <Separator className="my-8" />

          <div className="grid grid-cols-3 gap-6">
            {assets.slice(0, 3).map((asset) => (
              <Card key={asset.id}>
                <CardContent className="p-4">
                  <div className="w-full">
                    <Image
                      src={dummyImage}
                      alt=""
                      className="w-full object-cover"
                    />
                  </div>

                  <div className="mt-4">
                    <h4 className="text-gray-900 text-sm font-semibold pb-5 truncate">
                      {asset.title}
                    </h4>

                    <div className="flex justify-between gap-x-2">
                      <div className="flex flex-col gap-y-1">
                        <span className="text-xs">Usage time</span>
                        <span className="text-lg font-semibold text-gray-900">
                          {asset.usage_time_in_days}
                        </span>
                      </div>

                      <div className="flex flex-col gap-y-1">
                        <span className="text-xs">Catalog</span>
                        <span className="text-lg font-semibold text-gray-900">
                          {asset?.catalog ? (
                            asset?.catalog?.name
                          ) : (
                            <Badge variant="red">Not available</Badge>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {assets.length === 0 && (
        <EmptyTableInstance
          description="You don’t have any assets assigned to you yet."
          title="No assets assigned yet"
        />
      )}
    </div>
  );
};

export default Assets;
