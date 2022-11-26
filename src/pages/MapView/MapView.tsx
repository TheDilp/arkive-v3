import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { CRS, LatLngBoundsExpression } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { ImageOverlay, MapContainer } from "react-leaflet";
import { useParams } from "react-router-dom";

import ContextMenu from "../../components/ContextMenu/ContextMenu";
import MapImage from "../../components/Map/MapImage";
import { baseURLS, getURLS } from "../../types/CRUDenums";
import { MapPinType, MapType } from "../../types/mapTypes";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";

type Props = {
  isReadOnly?: boolean;
};

export default function MapView({ isReadOnly }: Props) {
  const queryClient = useQueryClient();
  const { project_id, item_id } = useParams();
  const [mapPins, setMapPins] = useState<MapPinType[]>([]);
  const [bounds, setBounds] = useState<number[][]>([
    [0, 0],
    [0, 0],
  ]);
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const mapRef = useRef() as any;
  const imgRef = useRef() as any;
  const cm = useRef() as any;
  const items = [
    {
      command: () => {
        setDrawer({ ...DefaultDrawer, data: drawer?.data, position: "left", show: true, type: "map_pins" });
      },
      icon: "pi pi-fw pi-map-marker",
      label: "New Token",
    },
    {
      command: () => mapRef?.current?.flyToBounds(bounds),
      label: "Fit Map",
    },
  ];

  const currentMap = queryClient.getQueryData<MapType[]>(["allItems", project_id, "maps"])?.find((map) => map.id === item_id);

  useEffect(() => {
    if (currentMap) {
      setMapPins(currentMap.map_pins);
      const img = new Image();
      img.src = `${baseURLS.baseServer}${getURLS.getSingleMapImage}${project_id}/${currentMap.map_image}`;
      img.onload = () => {
        setBounds([
          [0, 0],
          [img.height, img.width],
        ]);
        if (imgRef.current) {
          imgRef.current.setBounds([
            [0, 0],
            [img.height, img.width],
          ]);
          mapRef.current.fitBounds(
            [
              [0, 0],
              [img.height, img.width],
            ],
            {
              animate: false,
            },
          );
        }
      };
    }
  }, [currentMap, project_id]);
  useEffect(() => {
    //  Wait for map to finish loading
  }, [bounds]);
  return (
    <div className="w-full flex flex-col flex-1">
      <ContextMenu cm={cm} items={items} />
      <link href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" rel="stylesheet" />
      <MapContainer
        ref={mapRef}
        attributionControl={false}
        bounds={bounds as LatLngBoundsExpression}
        center={[bounds[1][0] / 2, bounds[1][1] / 2]}
        className="w-full h-full flex-1 outline-none bg-zinc-900"
        crs={CRS.Simple}
        maxZoom={2}
        minZoom={-3}
        scrollWheelZoom
        zoom={0}
        zoomSnap={0}>
        <MapImage
          bounds={bounds as LatLngBoundsExpression}
          cm={cm}
          imgRef={imgRef}
          isReadOnly={isReadOnly}
          mapPins={mapPins}
          src={`${baseURLS.baseServer}${getURLS.getSingleMapImage}${project_id}/${currentMap?.map_image}`}
        />
        <ImageOverlay
          ref={imgRef}
          bounds={[
            [0, 0],
            [0, 0],
          ]}
          url={`${baseURLS.baseServer}${getURLS.getSingleMapImage}${project_id}/${currentMap?.map_image}`}
        />
      </MapContainer>
    </div>
  );
}
