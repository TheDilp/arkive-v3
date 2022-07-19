import { LatLngBoundsExpression } from "leaflet";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import {
  ImageOverlay,
  LayerGroup,
  LayersControl,
  useMapEvents,
} from "react-leaflet";
import { useParams } from "react-router-dom";
import {
  MapLayerProps,
  MapProps,
  MarkerSidebarProps,
  UpdateMarkerInputs,
} from "../../../types/MapTypes";
import { MapMarkerDialogDefault } from "../../../utils/defaultDisplayValues";
import { supabaseStorageImagesLink } from "../../../utils/utils";
import MapMarker from "./MapMarker/MapMarker";
import MarkerContextMenu from "./MapMarker/MarkerContextMenu";
import MarkerUpdateDialog from "./MapMarker/MarkerUpdateDialog";
import MarkerSidebar from "./MarkerSidebar";

type Props = {
  src: string;
  bounds: LatLngBoundsExpression;
  imgRef: any;
  cm: any;
  public_view: boolean;
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
  public_view,
}: Props) {
  const mcm = useRef() as any;
  const [updateMarkerDialog, setUpdateMarkerDialog] =
    useState<UpdateMarkerInputs>({ ...MapMarkerDialogDefault, show: false });
  const [markerFilter, setMarkerFilter] = useState<"map" | "doc" | false>(
    false
  );
  const [markerSidebar, setMarkerSidebar] = useState<MarkerSidebarProps>({
    marker_title: "",
    map_id: undefined,
    doc_id: undefined,
    show: false,
  });
  const map = useMapEvents({
    contextmenu(e: any) {
      if (!public_view) {
        setNewTokenDialog({ ...e.latlng, show: false });
        cm.current.show(e.originalEvent);
      }
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
      <MarkerSidebar
        markerSidebar={markerSidebar}
        setMarkerSidebar={setMarkerSidebar}
      />
      <LayersControl position="topright">
        <LayersControl.BaseLayer name="Map" checked={true}>
          <ImageOverlay url={src} bounds={bounds} ref={imgRef} />
        </LayersControl.BaseLayer>

        {/* Markers layer */}
        <LayersControl.Overlay name="Markers" checked={true}>
          <LayerGroup>
            {markers
              .filter((marker) => {
                if (markerFilter === "map") {
                  return marker.map_link;
                } else if (markerFilter === "doc") {
                  return marker.doc_id;
                } else {
                  return true;
                }
              })
              .map((marker) => (
                <MapMarker
                  key={marker.id}
                  {...marker}
                  mcm={mcm}
                  public_view={public_view}
                  setUpdateMarkerDialog={setUpdateMarkerDialog}
                  setMarkerSidebar={setMarkerSidebar}
                />
              ))}
          </LayerGroup>
        </LayersControl.Overlay>

        {/* Other layers */}
        <LayerGroup>
          {map_layers
            .sort((a, b) => {
              if (a.title > b.title) return 1;
              if (a.title < b.title) return -1;
              return 0;
            })
            .filter(
              (layer) =>
                layer.image?.link && (public_view ? layer.public : true)
            )
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
