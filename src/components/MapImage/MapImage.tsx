import { useAtom } from "jotai";
import { LatLngBoundsExpression } from "leaflet";
import { MutableRefObject, useEffect, useState } from "react";
import { ImageOverlay, LayersControl, useMapEvents } from "react-leaflet";
import { MapPinType } from "../../types/mapTypes";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";

type Props = {
  cm: MutableRefObject<any>;
  src: string;
  bounds: LatLngBoundsExpression;
  imgRef: any;
  readOnly?: boolean;
  map_pins: MapPinType[];
  //   map_layers: MapLayerProps[];
};

export default function MapImage({ src, bounds, imgRef, cm, map_pins, readOnly }: Props) {
  const handleKeyUp = (e: KeyboardEvent) => {
    if (!e.shiftKey && !e.altKey) {
      setMarkerFilter(false);
    }
  };
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.shiftKey && e.altKey) {
      setMarkerFilter(false);
      return;
    }
    if (e.shiftKey) {
      setMarkerFilter("map");
    } else if (e.altKey) {
      setMarkerFilter("doc");
    }
  };
  const [markerFilter, setMarkerFilter] = useState<"map" | "doc" | false>(false);
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const map = useMapEvents({
    contextmenu(e: any) {
      if (!readOnly) {
        cm.current.show(e.originalEvent);
        setDrawer({ ...DefaultDrawer, data: { ...e.latlng } });
      }
    },
  });
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
  console.log(map_pins);
  return (
    <div>
      <LayersControl position="topright">
        <LayersControl.BaseLayer name="Map" checked={true}>
          <ImageOverlay url={src} bounds={bounds} ref={imgRef} />
        </LayersControl.BaseLayer>

        {/* Markers layer */}
        {/* <LayersControl.Overlay name="Markers" checked={true}>
          <LayerGroup>
            {map_pins
              .filter((map_pin: MapPinType) => {
                if (readOnly) {
                  if (map_pin.public) {
                    if (markerFilter === "map") {
                      return false;
                    } else if (markerFilter === "doc") {
                      return map_pin.doc_id;
                    } else {
                      return true;
                    }
                  } else {
                    return false;
                  }
                } else {
                  if (markerFilter === "map") {
                    return map_pin.map_link;
                  } else if (markerFilter === "doc") {
                    return map_pin.doc_id;
                  } else {
                    return true;
                  }
                }
              })
              .map((marker) => (
                <MapMarker
                  key={marker.id}
                  markerData={marker}
                  mcm={mcm}
                  public_view={readOnly}
                  setUpdateMarkerDialog={setUpdateMarkerDialog}
                  setMarkerSidebar={setMarkerSidebar}
                />
              ))}
          </LayerGroup>
        </LayersControl.Overlay>

     Other layers 
        <LayerGroup>
          {map_layers
            .sort((a, b) => {
              if (a.title > b.title) return 1;
              if (a.title < b.title) return -1;
              return 0;
            })
            .filter((layer) => layer.image?.link && (readOnly ? layer.public : true))
            .map((layer) => {
              return (
                <LayersControl.Overlay key={layer.id + layer.title} name={layer.title}>
                  <ImageOverlay url={supabaseStorageImagesLink + layer.image?.link} bounds={bounds} ref={imgRef} />
                </LayersControl.Overlay>
              );
            })}
        </LayerGroup>
        */}
      </LayersControl>
    </div>
  );
}
