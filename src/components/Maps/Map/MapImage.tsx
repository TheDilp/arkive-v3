import { LatLngBoundsExpression } from "leaflet";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import {
  ImageOverlay,
  LayerGroup,
  LayersControl,
  useMapEvents,
} from "react-leaflet";
import {
  MapLayerProps,
  MapProps,
  UpdateMarkerInputs,
} from "../../../types/MapTypes";
import { MapMarkerDialogDefault } from "../../../utils/defaultDisplayValues";
import { supabaseStorageImagesLink } from "../../../utils/utils";
import MapMarker from "./MapMarker/MapMarker";
import MarkerContextMenu from "./MapMarker/MarkerContextMenu";
import MarkerUpdateDialog from "./MapMarker/MarkerUpdateDialog";
type Props = {
  src: string;
  bounds: LatLngBoundsExpression;
  imgRef: any;
  cm: any;
  markers: MapProps["markers"];
  map_layers: MapLayerProps[];
  setNewTokenDialog: Dispatch<
    SetStateAction<{
      lat: number;
      lng: number;
      show: boolean;
    }>
  >;
};

export default function MapImage({
  src,
  bounds,
  imgRef,
  cm,
  markers,
  map_layers,
  setNewTokenDialog,
}: Props) {
  const mcm = useRef() as any;
  const [updateMarkerDialog, setUpdateMarkerDialog] =
    useState<UpdateMarkerInputs>({ ...MapMarkerDialogDefault, show: false });
  const [markerFilter, setMarkerFilter] = useState<"map" | "doc" | false>(
    false
  );

  const map = useMapEvents({
    contextmenu(e: any) {
      setNewTokenDialog({ ...e.latlng, show: false });
      cm.current.show(e.originalEvent);
    },
  });

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.shiftKey && e.altKey) {
        setMarkerFilter(false);
        return;
      }
      if (e.shiftKey) {
        setMarkerFilter("map");
      } else if (e.altKey) {
        setMarkerFilter("doc");
      }
    });
    document.addEventListener("keyup", (e) => {
      if (!e.shiftKey && !e.altKey) {
        setMarkerFilter(false);
      }
    });
    return () => {
      document.removeEventListener("keydown", () => {});
      document.removeEventListener("keyup", () => {});
    };
  }, []);

  return (
    <div>
      <MarkerContextMenu
        mcm={mcm}
        marker_id={updateMarkerDialog.id}
        setUpdateTokenDialog={setUpdateMarkerDialog}
      />
      <MarkerUpdateDialog
        {...updateMarkerDialog}
        setVisible={setUpdateMarkerDialog}
      />
      <LayersControl position="topright">
        <LayersControl.BaseLayer name="Map" checked={true}>
          <ImageOverlay url={src} bounds={bounds} ref={imgRef} />
        </LayersControl.BaseLayer>

        <LayersControl.Overlay name="Markers" checked={true}>
          <LayerGroup>
            {markers
              .filter((marker) =>
                markerFilter === "map"
                  ? marker.map_link
                  : markerFilter === "doc"
                  ? marker.doc_id
                  : true
              )
              .map((marker) => (
                <MapMarker
                  key={marker.id}
                  {...marker}
                  mcm={mcm}
                  setUpdateMarkerDialog={setUpdateMarkerDialog}
                />
              ))}
          </LayerGroup>
        </LayersControl.Overlay>

        <LayerGroup>
          {map_layers
            .sort((a, b) => {
              if (a.title > b.title) return 1;
              if (a.title < b.title) return -1;
              return 0;
            })
            .filter((layer) => layer.image?.link)
            .map((layer) => {
              return (
                <LayersControl.Overlay
                  key={layer.id + layer.title}
                  name={layer.title}
                >
                  <ImageOverlay
                    url={supabaseStorageImagesLink + layer.image?.link}
                    bounds={bounds}
                    ref={imgRef}
                  />
                </LayersControl.Overlay>
              );
            })}
        </LayerGroup>
      </LayersControl>
    </div>
  );
}
