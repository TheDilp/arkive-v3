import L, { LatLngExpression } from "leaflet";
import { Dispatch, SetStateAction, useState } from "react";
import ReactDOM from "react-dom/server";
import { Marker, Tooltip } from "react-leaflet";
import { useNavigate, useParams } from "react-router-dom";

import { useUpdateItem } from "../../CRUD/ItemsCRUD";
import { MapPinType } from "../../types/mapTypes";

export default function MapPin({ pinData: markerData, readOnly }: { pinData: MapPinType; readOnly?: boolean }) {
  const { id, parent, icon, color, backgroundColor, text, lat, lng, doc_id, map_link, public: markerPublic } = markerData;
  const { project_id, item_id } = useParams();
  const navigate = useNavigate();
  const updateMarkerMutation = useUpdateItem("map_pins");
  const [position, setPosition] = useState<LatLngExpression>([lat, lng]);
  const eventHandlers = {
    click: (e: any) => {
      //   if (!e.originalEvent.shiftKey && !e.originalEvent.altKey && !readOnly) {
      //   } else if (e.originalEvent.shiftKey && e.originalEvent.altKey) return;
      //   else if (e.originalEvent.shiftKey && map_link) {
      //     e.originalEvent.preventDefault();
      //     navigate(`../../${map_link}`);
      //   } else if (e.originalEvent.altKey && doc_id) {
      //     e.originalEvent.preventDefault();
      //     navigate(`../../../wiki/doc/${doc_id}`);
      //   }
    },
    // contextmenu: (e: any) => {
    //   if (!readOnly) {
    //   }
    // },
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
            <div className="absolute h-12 w-12">
              <div
                className="fixed h-full w-full rounded-full p-4"
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  //   if (!readOnly) {
                  //   }
                }}
                style={{
                  background: `url('https://api.iconify.design/mdi/${icon.replace(/.*:/g, "")}.svg?color=%23${color.replace(
                    "#",
                    "",
                  )}') no-repeat`,
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
        <Tooltip className="border-rounded-sm border-solid border-gray-800 bg-gray-800 p-2 text-lg text-white" direction="top">
          <div className="Lato text-center">{text}</div>
        </Tooltip>
      )}
    </Marker>
  );
}
