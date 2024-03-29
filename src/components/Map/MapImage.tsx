import { useSetAtom } from "jotai";
import { LatLngBoundsExpression } from "leaflet";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { ImageOverlay, LayerGroup, LayersControl, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useParams } from "react-router-dom";

import { useGetItem } from "../../hooks/useGetItem";
import { MapPinType, MapType } from "../../types/ItemTypes/mapTypes";
import { DrawerAtom, MapContextAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import MapPin from "./MapPin";

type Props = {
  cm: MutableRefObject<any>;
  src: string;
  bounds: LatLngBoundsExpression;
  imgRef: any;
  isReadOnly?: boolean;
  isClusteringPins: boolean;
};

export default function MapImage({ src, bounds, imgRef, cm, isReadOnly, isClusteringPins }: Props) {
  const firstRender = useRef(true);
  const { item_id, subitem_id } = useParams();
  const { data: currentMap } = useGetItem<MapType>(item_id as string, "maps", { staleTime: 60 * 1000 }, isReadOnly);
  const [markerFilter, setMarkerFilter] = useState<"map" | "doc" | false>(false);

  const PinFilter = (mapPin: MapPinType) => {
    if (isReadOnly) {
      if (mapPin.isPublic) {
        if (markerFilter === "map") {
          return false;
        }
        if (markerFilter === "doc") {
          return Boolean(mapPin.doc_id);
        }
        return true;
      }
      return false;
    }
    if (markerFilter === "map") {
      return Boolean(mapPin.map_link);
    }
    if (markerFilter === "doc") {
      return Boolean(mapPin.doc_id);
    }
    return true;
  };
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
  const setDrawer = useSetAtom(DrawerAtom);
  const setMapContext = useSetAtom(MapContextAtom);
  // eslint-disable-next-line no-unused-vars
  const map = useMapEvents({
    contextmenu(e: any) {
      if (!isReadOnly) {
        setMapContext({ type: "map" });
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

  useEffect(() => {
    if (subitem_id && currentMap) {
      const pin = currentMap.map_pins.find((map_pin) => map_pin.id === subitem_id);
      if (pin) map.panTo([pin.lat, pin.lng], {});
    } else if (firstRender.current) map.fitBounds(bounds);
    return () => {
      firstRender.current = false;
    };
  }, [subitem_id, bounds]);
  if (!map) return null;
  return (
    <div>
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Map">
          <ImageOverlay ref={imgRef} bounds={bounds} url={src} />
        </LayersControl.BaseLayer>

        {/* Markers layer */}
        <LayersControl.Overlay checked name="Markers">
          {isClusteringPins ? (
            <MarkerClusterGroup chunkedLoading removeOutsideVisibleBounds showCoverageOnHover>
              {currentMap?.map_pins &&
                currentMap?.map_pins
                  ?.filter(PinFilter)
                  .map((pin) => <MapPin key={pin.id} cm={cm} pinData={pin} readOnly={isReadOnly} />)}
            </MarkerClusterGroup>
          ) : (
            <LayerGroup>
              {currentMap?.map_pins &&
                currentMap?.map_pins
                  ?.filter(PinFilter)
                  .map((pin) => <MapPin key={pin.id} cm={cm} pinData={pin} readOnly={isReadOnly} />)}
            </LayerGroup>
          )}
        </LayersControl.Overlay>
        <LayerGroup>
          {currentMap?.map_layers?.length
            ? currentMap.map_layers
                .sort((a, b) => {
                  if (a.title > b.title) return 1;
                  if (a.title < b.title) return -1;
                  return 0;
                })
                .filter((layer) => layer.image && (isReadOnly ? layer.isPublic : true))
                .map((layer) => {
                  return (
                    <LayersControl.Overlay key={layer.id + layer.title} name={layer.title}>
                      <ImageOverlay bounds={bounds} className="leafletImageOverlayLayer " url={layer.image} zIndex={9999} />
                    </LayersControl.Overlay>
                  );
                })
            : null}
        </LayerGroup>
      </LayersControl>
    </div>
  );
}
