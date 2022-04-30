import L, { LatLngExpression } from "leaflet";
import { useState } from "react";
import ReactDOM from "react-dom/server";
import { Marker, Popup } from "react-leaflet";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MapMarker } from "../../../../custom-types";
import { useUpdateMapMarker } from "../../../../utils/customHooks";

export default function DraggableMarker({
  id,
  map_id,
  icon,
  color,
  text,
  lat,
  lng,
  doc_id,
  map_link,
  mcm,
  setUpdateMarkerDialog,
}: MapMarker & {
  mcm: any;
  setUpdateMarkerDialog: ({
    id,
    icon,
    text,
    color,
    doc_id,
    show,
  }: {
    id: string;
    icon: string;
    text: string;
    color: string;
    doc_id?: string;
    map_link?: string;
    show: boolean;
  }) => void;
}) {
  const { project_id } = useParams();
  const navigate = useNavigate();
  const updateMarkerMutation = useUpdateMapMarker();
  const [position, setPosition] = useState<LatLngExpression>([lat, lng]);
  const eventHandlers = {
    click: (e: any) => {
      if (e.originalEvent.shiftKey && map_link) {
        navigate(`../${map_link}`);
      }
    },
    contextmenu: (e: any) => {
      mcm.current.show(e.originalEvent);
      setUpdateMarkerDialog({
        id,
        icon,
        text,
        color,
        doc_id,
        map_link,
        show: false,
      });
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
  };
  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      icon={L.divIcon({
        iconSize: [48, 48],
        iconAnchor: [30, 46],
        popupAnchor: [-5, -20],
        className: "relative",

        html: ReactDOM.renderToString(
          <div className="relative">
            <div className="absolute w-3rem h-3rem flex justify-content-center align-items-center">
              <div
                style={{
                  zIndex: 999999,
                  background: `url('https://api.iconify.design/mdi/${icon}.svg?color=%23${color}') no-repeat`,
                  backgroundSize: "2rem",
                  backgroundPosition: "center",
                  backgroundColor: "#000",
                }}
                className="w-full h-full border-circle fixed p-4"
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setUpdateMarkerDialog({
                    id,
                    icon,
                    text,
                    color,
                    doc_id,
                    show: true,
                  });
                }}
              >
                {" "}
              </div>
            </div>
          </div>
        ),
      })}
    >
      {text && (
        <Popup position={[51.505, -0]}>
          {doc_id ? (
            <Link to={`../../wiki/${doc_id}`}>{text}</Link>
          ) : (
            <div className="Lato text-center">{text}</div>
          )}
        </Popup>
      )}
    </Marker>
  );
}
