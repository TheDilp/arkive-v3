import { LatLngBoundsExpression } from "leaflet";
import { ImageOverlay, useMapEvents } from "react-leaflet";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import DraggableMarker from "./DraggableMarker";
import { Map, MapMarker } from "../../../custom-types";
import { useEffect, useState } from "react";
import { useGetMapData } from "../../../utils/customHooks";
type Props = {
  src: string;
  bounds: LatLngBoundsExpression;
  imgRef: any;
  cm: any;
};

export default function MapImage({ src, bounds, imgRef, cm }: Props) {
  const { project_id, map_id } = useParams();
  const queryClient = useQueryClient();
  const map = useMapEvents({
    contextmenu(e: any) {
      cm.current.show(e.originalEvent);
    },
  });
  const mapData = useGetMapData(project_id as string, map_id as string);

  useEffect(() => {
    console.log(mapData);
  }, [mapData]);

  return (
    <>
      <ImageOverlay url={src} bounds={bounds} ref={imgRef} />
      {mapData?.markers.map((marker) => (
        <DraggableMarker key={marker.id} {...marker} />
      ))}
    </>
  );
}
