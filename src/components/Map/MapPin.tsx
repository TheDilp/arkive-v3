import L, { LatLngExpression } from "leaflet";
import { Dispatch, SetStateAction, useState } from "react";
import ReactDOM from "react-dom/server";
import { Marker, Tooltip } from "react-leaflet";
import { useNavigate, useParams } from "react-router-dom";
import { MapPinType } from "../../types/mapTypes";

export default function MapPin({ pinData: markerData, readOnly }: { pinData: MapPinType; readOnly?: boolean }) {
  const {
    id,
    parent,
    icon,
    color,
    backgroundColor,
    text,
    lat,
    lng,
    doc_id,
    map_link,
    public: markerPublic,
  } = markerData;
  const { project_id } = useParams();
  const navigate = useNavigate();
  //   const updateMarkerMutation = useUpdateMapMarker();
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
        setPosition(e.target._latlng);
        // updateMarkerMutation.mutate({
        //   id,
        //   lat: e.target._latlng.lat,
        //   lng: e.target._latlng.lng,
        //   map_id,
        //   project_id: project_id as string,
        //   public: markerPublic,
        // });
      }
    },
  };
  return (
    <Marker
      draggable={!readOnly}
      eventHandlers={eventHandlers}
      position={position}
      icon={L.divIcon({
        className: "relative",
        html: ReactDOM.renderToString(
          <div className="relative">
            <div className="w-12 h-12 absolute">
              <div
                style={{
                  background: `url('https://api.iconify.design/mdi/${icon.replace(
                    /.*:/g,
                    "",
                  )}.svg?color=%23${color.replace("#", "")}') no-repeat`,
                  backgroundColor,
                  backgroundPosition: "center",
                  backgroundSize: "2rem",
                  border: "white solid 3px",
                  zIndex: 999999,
                }}
                className="w-full h-full p-4 fixed rounded-full"
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  //   if (!readOnly) {
                  //   }
                }}></div>
            </div>
          </div>,
        ),
        iconAnchor: [30, 46],
        iconSize: [48, 48],
        tooltipAnchor: [-5, -20],
      })}>
      {text && (
        <Tooltip
          direction="top"
          className="p-2 text-lg text-white bg-gray-800 border-gray-800 border-solid border-rounded-sm">
          <div className="text-center Lato">{text}</div>
        </Tooltip>
      )}
    </Marker>
  );
}
