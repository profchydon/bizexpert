import React, { useMemo } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import MarkerCluster from "react-leaflet-cluster";

interface Props {
  mapData: {
    lat: number;
    lng: number;
    address?: string;
  }[];
}
const CustomMap: React.FC<Props> = ({ mapData }) => {
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
    [],
  );

  return (
    <div>
      <MapContainer center={center} zoom={1.4}>
        <TileLayer
          attribution="Google Maps"
          url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
          className="grayscale"
        />
        <MarkerCluster chunkedLoading>
          {mapData.map((map, index) => (
            <Marker key={index} position={[map.lat, map.lng]} icon={customIcon}>
              <Popup>{map.address}</Popup>
            </Marker>
          ))}
        </MarkerCluster>
      </MapContainer>
    </div>
  );
};

export default CustomMap;
