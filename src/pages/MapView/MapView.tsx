import { useAtom } from "jotai";
import { CRS, LatLngBoundsExpression } from "leaflet";
import { useEffect, useRef, useState } from "react";

import { ImageOverlay, MapContainer } from "react-leaflet";
import { useParams } from "react-router-dom";
import ContextMenu from "../../components/ContextMenu/ContextMenu";
import { useGetItem } from "../../hooks/getItemHook";
import { baseURLS, getURLS } from "../../types/CRUDenums";
import { MapType } from "../../types/mapTypes";
import { DialogAtom } from "../../utils/Atoms/atoms";
import { DefaultDialog } from "../../utils/DefaultValues/DrawerDialogDefaults";

type Props = {
  readOnly?: boolean;
};

export default function MapView({ readOnly }: Props) {
  const { project_id, item_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [bounds, setBounds] = useState<number[][]>([
    [0, 0],
    [0, 0],
  ]);
  const [dialog, setDialog] = useAtom(DialogAtom);
  const mapRef = useRef() as any;
  const imgRef = useRef() as any;
  const cm = useRef() as any;
  const items = [
    {
      command: () => {
        setDialog({ ...DefaultDialog, show: true });
      },
      icon: "pi pi-fw pi-map-marker",
      label: "New Token",
    },
    {
      command: () => mapRef?.current?.flyToBounds(bounds),
      label: "Fit Map",
    },
  ];

  const currentMap = useGetItem(project_id as string, item_id as string, "maps") as MapType;

  useEffect(() => {
    if (currentMap) {
      setLoading(true);
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
        setLoading(false);
      };
    }
  }, [currentMap]);
  useEffect(() => {
    //  Wait for map to finish loading
  }, [bounds]);

  return (
    <div
      className="w-full flex flex-col flex-1"
      onContextMenu={(e) => {
        cm.current.show(e);
      }}>
      <ContextMenu cm={cm} items={items} />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" />
      <MapContainer
        ref={mapRef}
        className="w-full h-full flex-1 outline-none bg-zinc-900"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //    @ts-ignore
        center={[bounds[1][0] / 2, bounds[1][1] / 2]}
        zoom={0}
        minZoom={-3}
        maxZoom={2}
        scrollWheelZoom={true}
        zoomSnap={0}
        crs={CRS.Simple}
        bounds={bounds as LatLngBoundsExpression}
        attributionControl={false}>
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
