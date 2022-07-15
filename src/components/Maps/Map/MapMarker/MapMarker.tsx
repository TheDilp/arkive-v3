import L, { LatLngExpression } from "leaflet";
import { Dispatch, SetStateAction, useState } from "react";
import ReactDOM from "react-dom/server";
import { Marker, Tooltip } from "react-leaflet";
import { useNavigate, useParams } from "react-router-dom";
import { MapMarkerProps, MarkerSidebarProps } from "../../../../types/MapTypes";
import { useUpdateMapMarker } from "../../../../utils/customHooks";

export default function MapMarker({
  id,
  map_id,
  icon,
  color,
  backgroundColor,
  text,
  lat,
  lng,
  doc_id,
  map_link,
  mcm,
  setUpdateMarkerDialog,
  setMarkerSidebar,
}: MapMarkerProps & {
  mcm: any;
  setMarkerSidebar: Dispatch<SetStateAction<MarkerSidebarProps>>;
  setUpdateMarkerDialog: Dispatch<
    SetStateAction<{
      id: string;
      icon: string;
      text: string;
      color: string;
      backgroundColor: string;
      doc_id?: string;
      map_link?: string;
      show: boolean;
    }>
  >;
}) {
  const { project_id } = useParams();
  const navigate = useNavigate();
  const updateMarkerMutation = useUpdateMapMarker();
  const [position, setPosition] = useState<LatLngExpression>([lat, lng]);
  const eventHandlers = {
    click: (e: any) => {
      if (!e.originalEvent.shiftKey && !e.originalEvent.altKey) {
        setMarkerSidebar({
          marker_title: text,
          map_id: map_link,
          doc_id,
          show: true,
        });
      } else if (e.originalEvent.shiftKey && e.originalEvent.altKey) return;
      else if (e.originalEvent.shiftKey && map_link) {
        e.originalEvent.preventDefault();
        navigate(`../../${map_link}`);
      } else if (e.originalEvent.altKey && doc_id) {
        e.originalEvent.preventDefault();
        navigate(`../../../wiki/doc/${doc_id}`);
      }
    },
    contextmenu: (e: any) => {
      mcm.current.show(e.originalEvent);
      setUpdateMarkerDialog({
        id,
        icon,
        text,
        color,
        backgroundColor,
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
            <div className="absolute w-3rem h-3rem ">
              <div
                style={{
                  zIndex: 999999,
                  background: `url('https://api.iconify.design/mdi/${icon.replace(
                    /.*:/g,
                    ""
                  )}.svg?color=%23${color.replace("#", "")}') no-repeat`,
                  backgroundSize: "2rem",
                  backgroundPosition: "center",
                  backgroundColor,
                  border: "white solid 3px",
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
                    backgroundColor,
                    doc_id,
                    show: true,
                  });
                }}
              ></div>
            </div>
          </div>
        ),
      })}
    >
      {text && (
        <Tooltip
          offset={[0, -50]}
          direction="top"
          className="p-2 bg-gray-800 border-rounded-sm border-gray-800 border-solid text-white text-lg"
        >
          <div className="Lato text-center">{text}</div>
        </Tooltip>
      )}
    </Marker>
  );
}
