import { CRS, LatLngBoundsExpression } from "leaflet";
import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect, useRef, useState } from "react";
import { MapContainer } from "react-leaflet";
import { useParams } from "react-router-dom";

import ContextMenu from "../../components/ContextMenu/ContextMenu";
import MapImage from "../../components/Map/MapImage";
import { useDeleteItem } from "../../CRUD/ItemsCRUD";
import { useGetItem } from "../../hooks/useGetItem";
import { MapType } from "../../types/ItemTypes/mapTypes";
import { useMapContextMenuItems } from "../../utils/contextMenus";

type Props = {
  isReadOnly?: boolean;
};

export default function MapView({ isReadOnly }: Props) {
  const { project_id, item_id } = useParams();
  const deleteMapPin = useDeleteItem("map_pins", project_id as string);
  const [bounds, setBounds] = useState<number[][]>([
    [0, 0],
    [0, 0],
  ]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef() as any;
  const imgRef = useRef() as any;
  const cm = useRef() as any;

  const { data: currentMap, isLoading } = useGetItem<MapType>(item_id as string, "maps", { staleTime: 60 * 1000 }, isReadOnly);

  const items = useMapContextMenuItems({ mapRef, bounds, deleteMapPin });
  useEffect(() => {
    if (currentMap && currentMap?.image) {
      const img = new Image();
      img.src = currentMap.image;
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

  if (loading || isLoading) return <ProgressSpinner />;
  if (!currentMap) return null;
  return (
    <div className="flex h-full w-full flex-col">
      <link href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" rel="stylesheet" />
      <ContextMenu cm={cm} items={items} />
      {/* This div is needed for layers to properly work */}
      {currentMap ? (
        <div className="h-full w-full">
          <MapContainer
            ref={mapRef}
            attributionControl={false}
            bounds={bounds as LatLngBoundsExpression}
            center={[bounds[1][0] / 2, bounds[1][1] / 2]}
            className="h-full w-full flex-1 bg-zinc-900 outline-none"
            crs={CRS.Simple}
            maxZoom={2}
            minZoom={-3}
            scrollWheelZoom
            zoom={1}
            zoomSnap={0}>
            <MapImage
              bounds={bounds as LatLngBoundsExpression}
              cm={cm}
              imgRef={imgRef}
              isClusteringPins={currentMap.clusterPins}
              isReadOnly={isReadOnly}
              src={currentMap?.image || ""}
            />
          </MapContainer>
        </div>
      ) : null}
    </div>
  );
}
