import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import MarkerCluster from "react-leaflet-cluster";
import React, { useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  GeoJSON,
} from "react-leaflet";
import { map_lappy, map_safe } from "@/assets/icons";
import Image from "next/image";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useWorkspaceDashboardCountrySummaryQuery } from "@/hooks/useWorkspaceDashboardQueries";
import { useMapContext } from "@/container/Dashboard/Overview/OverviewDashboardMap/CountrySelectMap/MapContext";
import WorldData from "world-map-geojson";
import { Button } from "@/components/ui/button";

interface Props {
  mapData: {
    lat: number;
    lng: number;
    flags?: string;
    flag?: string;
    address: string;
  }[];
}

const DashboardMap: React.FC<Props> = ({ mapData }) => {
  const { changeDefaultCountry } = useMapContext();
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();

  const { data: dashboardCountrySummaryRes } =
    useWorkspaceDashboardCountrySummaryQuery({ skip: !company?.id });

  const dashboardCountrySummary = dashboardCountrySummaryRes?.data ?? [];

  const customIcon = new Icon({
    iconUrl:
      "https://res.cloudinary.com/db37j4moo/image/upload/v1700567791/_Map_location_marker_eabzlh.png",
    iconSize: [40, 40],
  });

  const center = useMemo<any>(
    () => [
      mapData.length > 0 ? mapData[0].lat : 0,
      mapData.length > 0 ? mapData[0].lng : 0,
    ],
    [mapData],
  );

  const getCountryColor = (summary: any) => {
    if (!summary) return "#E9EAEB";
    const totalActivity =
      (summary?.employee_count ?? 0) +
      (summary?.equipment_count ?? 0) +
      (summary?.equipment_in_storage_count ?? 0);
    return totalActivity > 0 ? "#B4D0FF" : "#E9EAEB";
  };

  const getCountryStyle = (feature: any) => {
    const countryName = feature.properties?.name;
    const summary = dashboardCountrySummary.find(
      (item) => item.country === countryName,
    );
    return {
      fillColor: getCountryColor(summary),
      weight: 0,
      opacity: 0,
      color: "transparent",
      fillOpacity: 1,
    };
  };

  return (
    <div className="h-[528px] w-full relative bg-white">
      <MapContainer
        key={JSON.stringify(center)}
        center={center}
        zoom={2.0}
        zoomControl={false}
        style={{ height: "100%", width: "100%", background: "#ffffff" }}
      >
        <TileLayer
          attribution=""
          url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
        />

        <GeoJSON data={WorldData as any} style={getCountryStyle} />

        <MarkerCluster chunkedLoading>
          {mapData.map((map, index) => {
            const summary = dashboardCountrySummary.find(
              (item) =>
                item.country.toLowerCase() === map.address.toLowerCase(),
            );

            return (
              <Marker
                key={index}
                position={[map.lat, map.lng]}
                icon={customIcon}
                eventHandlers={{
                  mouseover: (e) => e.target.openTooltip(),
                  mouseout: (e) => e.target.closeTooltip(),
                  click: () => {
                    changeDefaultCountry({
                      label: summary?.country ?? "",
                      value: summary?.country_id ?? "",
                    });
                  },
                }}
              >
                <Tooltip
                  permanent={false}
                  direction="top"
                  offset={[0, -20]}
                  className="border-none rounded-lg border-0 shadow-2xl bg-white text-sm font-ibmPlexSans"
                >
                  <div className="w-80 border-0 flex flex-col justify-center">
                    <div className="p-3 pb-0 flex flex-col gap-y-2">
                      <div className="flex flex-col items-center gap-y-2">
                        {map.flags && (
                          <Image
                            src={map.flags}
                            alt={`${map.address} flag`}
                            width={24}
                            height={24}
                            className="object-cover mb-2"
                          />
                        )}
                        <div className="flex flex-row items-center gap-x-1 font-semibold">
                          {summary?.employee_count ?? "0"} Employee(s),
                          <h3 className="font-semibold text-gray-900">
                            {map?.address}
                          </h3>
                        </div>
                      </div>

                      <div className="pl-2 flex flex-row items-center justify-center gap-x-1 my-1">
                        <Image
                          src={map_lappy}
                          alt="laptop"
                          width={22}
                          height={22}
                          className="object-cover"
                        />
                        <div className="flex flex-row items-center gap-x-1 font-normal mr-1 text-gray-500">
                          <span className="font-semibold text-gray-600">
                            ({summary?.equipment_count ?? "0"})
                          </span>
                          Equipment(s)
                        </div>

                        <Image
                          src={map_safe}
                          alt="safe"
                          width={22}
                          height={22}
                          className="object-cover"
                        />
                        <div className="flex flex-row items-center gap-x-1 text-gray-500">
                          <span className="font-semibold text-gray-600">
                            ({summary?.equipment_in_storage_count ?? "0"})
                          </span>
                          Item(s) stored
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="text-sm border-none my-0 text-[#535862] p-0 font-semibold"
                        onClick={() =>
                          changeDefaultCountry({
                            label: summary?.country ?? "",
                            value: summary?.country_id ?? "",
                          })
                        }
                        data-testid="dashboardmap-button"
                      >
                        Click the dot for more info
                      </Button>
                    </div>
                  </div>
                </Tooltip>
              </Marker>
            );
          })}
        </MarkerCluster>
      </MapContainer>
    </div>
  );
};

export default DashboardMap;
