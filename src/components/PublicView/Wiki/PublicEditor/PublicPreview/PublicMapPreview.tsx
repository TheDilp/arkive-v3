import { CRS, divIcon, LatLngBoundsExpression, Map } from "leaflet";
import { MutableRefObject, useLayoutEffect, useRef, useState } from "react";
import { renderToString } from "react-dom/server";
import { ImageOverlay, MapContainer, Marker, Tooltip } from "react-leaflet";
import { useQuery } from "react-query";
import { getSingleMap } from "../../../../../utils/supabaseUtils";
import { supabaseStorageImagesLink } from "../../../../../utils/utils";
import LoadingScreen from "../../../../Util/LoadingScreen";
import { MapPreviewAttributes } from "../../../../Wiki/Editor/CustomExtensions/CustomPreviews/MapPreviewExtension";

export default function PublicMapPreview({
  id,
  width,
  height,
}: MapPreviewAttributes) {
  const mapRef = useRef() as MutableRefObject<Map>;
  const [bounds, setBounds] = useState<number[][] | null>(null);
  const { data: map, isLoading } = useQuery(
    id as string,
    async () => await getSingleMap(id as string)
  );
  useLayoutEffect(() => {
    if (map && id) {
      let img = new Image();
      img.src = supabaseStorageImagesLink + map.map_image?.link || "";
      img.onload = () => {
        setBounds([
          [0, 0],
          [img.height, img.width],
        ]);

        setTimeout(() => {
          mapRef.current.fitBounds([
            [0, 0],
            [img.height, img.width],
          ]);
        }, 1000);
      };
    }
  }, [id, map]);

  if (!bounds || !map) return null;
  if (isLoading) return <LoadingScreen />;
  return (
    <div
      style={{
        width,
        height,
      }}
    >
      <MapContainer
        ref={mapRef}
        zoomControl={false}
        className="w-full h-full bg-gray-700 border-rounded-sm relative outline-none"
        center={[bounds[1][0] / 2, bounds[1][1] / 2]}
        zoom={-1}
        minZoom={-3}
        maxZoom={2}
        scrollWheelZoom={true}
        zoomSnap={0}
        crs={CRS.Simple}
        bounds={bounds as LatLngBoundsExpression}
        attributionControl={false}
      >
        <ImageOverlay
          url={supabaseStorageImagesLink + map.map_image?.link || ""}
          bounds={bounds as LatLngBoundsExpression}
        />
        {map.markers
          .filter((marker) => marker.public)
          .map((marker) => (
            <Marker
              key={marker.id}
              draggable={false}
              position={[marker.lat, marker.lng]}
              icon={divIcon({
                iconSize: [48, 48],
                iconAnchor: [30, 46],
                tooltipAnchor: [-5, -20],
                className: "relative",
                html: renderToString(
                  <div className="relative">
                    <div className="absolute w-3rem h-3rem ">
                      <div
                        style={{
                          zIndex: 999999,
                          background: `url('https://api.iconify.design/mdi/${marker.icon.replace(
                            /.*:/g,
                            ""
                          )}.svg?color=%23${marker.color.replace(
                            "#",
                            ""
                          )}') no-repeat`,
                          backgroundSize: "2rem",
                          backgroundPosition: "center",
                          backgroundColor: marker.backgroundColor,
                          border: "white solid 3px",
                        }}
                        className="w-full h-full border-circle fixed p-4"
                      ></div>
                    </div>
                  </div>
                ),
              })}
            >
              {marker.text && (
                <Tooltip
                  direction="top"
                  className="p-2 bg-gray-800 border-rounded-sm border-gray-800 border-solid text-white text-lg"
                >
                  <div className="Lato text-center">{marker.text}</div>
                </Tooltip>
              )}
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
