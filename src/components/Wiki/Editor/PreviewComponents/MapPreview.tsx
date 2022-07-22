import { CRS, divIcon, LatLngBoundsExpression, Map } from "leaflet";
import React, {
  MutableRefObject,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { renderToString } from "react-dom/server";
import { ImageOverlay, MapContainer, Marker, Tooltip } from "react-leaflet";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { MapProps } from "../../../../types/MapTypes";
import { supabaseStorageImagesLink } from "../../../../utils/utils";
import { MapPreviewAttributes } from "../CustomExtensions/CustomPreviews/MapPreviewExtension";

export default function MapPreview({ id }: MapPreviewAttributes) {
  const { project_id } = useParams();
  const queryClient = useQueryClient();

  const maps = queryClient.getQueryData<MapProps[]>(`${project_id}-maps`);
  const mapRef = useRef() as MutableRefObject<Map>;
  const imgRef = useRef() as any;

  const [mapData, setMapdata] = useState<MapProps | null>(null);
  const [bounds, setBounds] = useState<number[][] | null>(null);

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
          if (imgRef.current) {
            // Timeout to ensure transition happens during fade animation
            setTimeout(() => {
              imgRef.current.setBounds([
                [0, 0],
                [img.height, img.width],
              ]);
            }, 250);
          }
        };
      }
    }
  }, [id]);

  if (!bounds || !mapData) return null;

  return (
    <MapContainer
      ref={mapRef}
      className="w-full h-full bg-gray-900 relative outline-none"
      center={[bounds[1][0] / 2, bounds[1][1] / 2]}
      zoom={0}
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
        ref={imgRef}
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
  );
}
