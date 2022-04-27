import L, { LatLngExpression } from "leaflet";
import { useMemo, useState } from "react";
import ReactDOM from "react-dom/server";
import { Marker, Popup } from "react-leaflet";
import { Link, useParams } from "react-router-dom";
import { MapMarker } from "../../../custom-types";
import { useUpdateMapMarker } from "../../../utils/customHooks";

export default function DraggableMarker({
  id,
  map_id,
  icon,
  color,
  text,
  lat,
  lng,
  doc_id,
}: MapMarker) {
  const { project_id } = useParams();
  const updateMarkerMutation = useUpdateMapMarker();
  const [position, setPosition] = useState<LatLngExpression>([lat, lng]);
  const eventHandlers = useMemo(
    () => ({
      contextmenu: (e: any) => {
        alert("BZZZZ");
      },
      dragend(e: any) {
        setPosition(e.target._latlng);
        updateMarkerMutation.mutate({
          id,
          map_id,
          lat: e.target._latlng.lat,
          lng: e.target._latlng.lng,
          project_id: project_id as string,
        });
      },
    }),
    []
  );
  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      icon={L.divIcon({
        iconSize: [48, 48],
        iconAnchor: [30, 46],
        popupAnchor: [18, 0],
        className: "bg-transparent  relative ",
        html: ReactDOM.renderToString(
          <div
            className="text-xl w-2rem h-2rem absolute"
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              alert("BZZZZZ");
            }}
          >
            <div
              style={{
                zIndex: 999999,
                background: `url('https://api.iconify.design/mdi/${icon}.svg?color=%23${color}') no-repeat`,
                backgroundSize: "2rem",
                backgroundPosition: "center",
                backgroundColor: "black",
              }}
              className="w-full h-full absolute border-circle p-4"
            ></div>
          </div>
        ),
      })}
    >
      {text && (
        <Popup position={[51.505, -0]}>
          {doc_id ? (
            <Link to={`../../wiki/${doc_id}`}>{text}</Link>
          ) : (
            <span className="Lato">{text}</span>
          )}
        </Popup>
      )}
    </Marker>
  );
}
