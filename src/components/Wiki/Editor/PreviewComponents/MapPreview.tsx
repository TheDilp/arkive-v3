import { CRS, divIcon, LatLngBoundsExpression, Map } from "leaflet";
import React, {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { renderToString } from "react-dom/server";
import { ImageOverlay, MapContainer, Marker, Tooltip } from "react-leaflet";
import { useQueryClient } from "react-query";
import { Resizable } from "re-resizable";
import { useParams } from "react-router-dom";
import { MapProps } from "../../../../types/MapTypes";
import { supabaseStorageImagesLink } from "../../../../utils/utils";
import { MapPreviewAttributes } from "../CustomExtensions/CustomPreviews/MapPreviewExtension";

export default function MapPreview({
  id,
  width,
  height,
  updateId,
}: MapPreviewAttributes) {
  const { project_id } = useParams();
  const queryClient = useQueryClient();

  const maps = queryClient.getQueryData<MapProps[]>(`${project_id}-maps`);
  const mapRef = useRef() as MutableRefObject<Map>;
  const [mapData, setMapdata] = useState<MapProps | null>(null);
  const [bounds, setBounds] = useState<number[][] | null>(null);
  const [dims, setDims] = useState({ width, height });
  useLayoutEffect(() => {
    if (maps && id) {
      let map = maps.find((map) => map.id === id);
      if (map) {
        setMapdata(map);
        let img = new Image();
        img.src = supabaseStorageImagesLink + map.map_image?.link || "";
        img.onload = () => {
          setBounds([
            [0, 0],
            [img.height, img.width],
          ]);
        };
      }
    }
  }, [id]);

  useEffect(() => {
    if (updateId)
      setTimeout(() => {
        updateId({ height: dims.height, width: dims.width });
      }, 100);
  }, []);
  if (!bounds || !mapData) return null;
  return (
    <Resizable
      className=""
      bounds="parent"
      minWidth={615}
      minHeight={480}
      size={dims}
      onResizeStop={(e, dir, ref, delta) => {
        // Delta provides DELTAS (differences, changes) for the resizing, not the total and absolute dimensions
        // We update the old size with the differences provided
        setDims({
          width: dims.width + delta.width,
          height: dims.height + delta.height,
        });
        if (updateId)
          updateId({
            height: dims.height + delta.height,
            width: dims.width + delta.width,
          });
      }}
    >
      <MapContainer
        ref={mapRef}
        zoomControl={false}
        className="w-full h-full bg-gray-800 border-rounded-sm relative outline-none"
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
          url={supabaseStorageImagesLink + mapData.map_image?.link || ""}
          bounds={bounds as LatLngBoundsExpression}
        />
        {mapData.markers.map((marker) => (
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
    </Resizable>
  );
}
