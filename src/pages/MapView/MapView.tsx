import { useAtom } from "jotai";
import { CRS, LatLngBoundsExpression } from "leaflet";
import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect, useRef, useState } from "react";
import { ImageOverlay, MapContainer } from "react-leaflet";
import { useParams } from "react-router-dom";

import ContextMenu from "../../components/ContextMenu/ContextMenu";
import MapImage from "../../components/Map/MapImage";
import { useGetItem } from "../../hooks/getItemHook";
import { baseURLS, getURLS } from "../../types/CRUDenums";
import { MapPinType, MapType } from "../../types/mapTypes";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";

type Props = {
  isReadOnly?: boolean;
};

export default function MapView({ isReadOnly }: Props) {
  const { project_id, item_id, pin_id } = useParams();
  const [bounds, setBounds] = useState<number[][]>([
    [0, 0],
    [0, 0],
  ]);
  const [loading, setLoading] = useState(true);
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
      command: () => mapRef?.current?.fitBounds(bounds),
      label: "Fit Map",
    },
  ];
  const currentMap = useGetItem(project_id as string, item_id as string, "maps") as MapType;
  useEffect(() => {
    if (currentMap) {
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
        }
        setLoading(false);
      };
    }
  }, [currentMap, project_id]);

  if (loading) return <ProgressSpinner />;
  return (
    <div className="flex flex-col w-full h-full">
      <link href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" rel="stylesheet" />
      <ContextMenu cm={cm} items={items} />
      {/* This div is needed for layers to properly work */}
      {currentMap ? (
        <div className="w-full h-full">
          <MapContainer
            ref={mapRef}
            attributionControl={false}
            bounds={bounds as LatLngBoundsExpression}
            center={[bounds[1][0] / 2, bounds[1][1] / 2]}
            className="flex-1 w-full h-full outline-none bg-zinc-900"
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
      ) : null}
    </div>
  );
}
