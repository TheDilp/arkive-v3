import { useAtom } from "jotai";
import { LatLngBoundsExpression } from "leaflet";
import { MutableRefObject, useEffect, useLayoutEffect, useState } from "react";
import { ImageOverlay, LayerGroup, LayersControl, useMapEvents } from "react-leaflet";
import { useParams } from "react-router-dom";

import { useGetItem } from "../../hooks/getItemHook";
import { MapPinType, MapType } from "../../types/mapTypes";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import MapPin from "./MapPin";

type Props = {
  cm: MutableRefObject<any>;
  src: string;
  bounds: LatLngBoundsExpression;
  imgRef: any;
  isReadOnly?: boolean;
  mapPins: MapPinType[];
  //   map_layers: MapLayerProps[];
};

export default function MapImage({ src, bounds, imgRef, cm, isReadOnly, mapPins }: Props) {
  const { project_id, item_id } = useParams();
  const currentMap = useGetItem(project_id as string, item_id as string, "maps") as MapType;
  const [pins, setPins] = useState(currentMap?.map_pins);
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
  const [, setDrawer] = useAtom(DrawerAtom);
  // eslint-disable-next-line no-unused-vars
  const map = useMapEvents({
    contextmenu(e: any) {
      if (!isReadOnly) {
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

  useLayoutEffect(() => {
    if (currentMap?.map_pins) setPins(currentMap.map_pins);
  }, [currentMap?.map_pins]);

  return (
    <div>
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Map">
          <ImageOverlay ref={imgRef} bounds={bounds} url={src} />
        </LayersControl.BaseLayer>

        {/* Markers layer */}
        <LayersControl.Overlay checked name="Markers">
          <LayerGroup>
            {pins &&
              pins
                ?.filter((mapPin: MapPinType) => {
                  if (isReadOnly) {
                    if (mapPin.public) {
                      if (markerFilter === "map") {
                        return false;
                      }
                      if (markerFilter === "doc") {
                        return mapPin.doc_id;
                      }
                      return true;
                    }
                    return false;
                  }
                  if (markerFilter === "map") {
                    return mapPin.map_link;
                  }
                  if (markerFilter === "doc") {
                    return mapPin.doc_id;
                  }
                  return true;
                })
                .map((pin) => <MapPin key={pin.id} pinData={pin} readOnly={isReadOnly} />)}
          </LayerGroup>
        </LayersControl.Overlay>
        {/*
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
