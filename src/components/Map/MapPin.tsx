import { useAtom } from "jotai";
import L, { LatLngExpression } from "leaflet";
import { MutableRefObject, useState } from "react";
import ReactDOM from "react-dom/server";
import { Marker, Tooltip } from "react-leaflet";
import { useNavigate } from "react-router-dom";

import { useUpdateSubItem } from "../../CRUD/ItemsCRUD";
import { MapPinType } from "../../types/mapTypes";
import { DrawerAtom, MapContextAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";

export default function MapPin({
  pinData: markerData,
  cm,
  readOnly,
}: {
  pinData: MapPinType;
  cm: MutableRefObject<any>;
  readOnly?: boolean;
}) {
  const { id, icon, color, backgroundColor, text, lat, lng, doc_id, map_link, public: markerPublic } = markerData;
  const navigate = useNavigate();
  const updateMarkerMutation = useUpdateSubItem("map_pins", "maps");
  const [position, setPosition] = useState<LatLngExpression>([lat, lng]);
  const [, setDrawer] = useAtom(DrawerAtom);
  const [, setMapContext] = useAtom(MapContextAtom);

  const eventHandlers = {
    click: (e: any) => {
      if (!e.originalEvent.shiftKey && !e.originalEvent.altKey && !readOnly) return;
      if (e.originalEvent.shiftKey && e.originalEvent.altKey) return;
      if (e.originalEvent.shiftKey && map_link) {
        e.originalEvent.preventDefault();
        navigate(`../../${map_link}`);
      } else if (e.originalEvent.altKey && doc_id) {
        e.originalEvent.preventDefault();
        navigate(`../../../wiki/doc/${doc_id}`);
      }
    },
    contextmenu: (e: any) => {
      if (!readOnly) {
        setMapContext({ type: "pin" });
        cm.current.show(e.originalEvent);
        setDrawer({ ...DefaultDrawer, data: { ...markerData, ...e.latlng } });
      }
    },
    dragend(e: any) {
      if (!readOnly) {
        // eslint-disable-next-line no-underscore-dangle
        setPosition(e.target._latlng);
        updateMarkerMutation.mutate({
          id,
          lat: e.target._latlng.lat,
          lng: e.target._latlng.lng,
          public: markerPublic,
        });
      }
    },
  };
  return (
    <Marker
      draggable={!readOnly}
      eventHandlers={eventHandlers}
      icon={L.divIcon({
        className: "relative",
        html: ReactDOM.renderToString(
          <div className="relative">
            <div className="absolute w-12 h-12">
              <div
                className="fixed w-full h-full p-4 rounded-full"
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                style={{
                  background: `url('https://api.iconify.design/mdi/${icon ? icon?.replace(/.*:/g, "") : ""}.svg?color=%23${
                    color ? color.replace("#", "") : ""
                  }') no-repeat`,
                  backgroundColor,
                  backgroundPosition: "center",
                  backgroundSize: "2rem",
                  border: "white solid 3px",
                  zIndex: 999999,
                }}
              />
            </div>
          </div>,
        ),
        iconAnchor: [30, 46],
        iconSize: [48, 48],
        tooltipAnchor: [-5, -20],
      })}
      position={position}>
      {text && (
        <Tooltip className="p-2 text-lg text-white bg-gray-800 border-gray-800 border-solid border-rounded-sm" direction="top">
          <div className="text-center Lato">{text}</div>
        </Tooltip>
      )}
    </Marker>
  );
}
