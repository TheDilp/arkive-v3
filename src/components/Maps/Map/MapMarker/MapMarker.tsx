import L, { LatLngExpression } from "leaflet";
import { Dispatch, SetStateAction, useState } from "react";
import ReactDOM from "react-dom/server";
import { Marker, Tooltip } from "react-leaflet";
import { useNavigate, useParams } from "react-router-dom";
import {
  MapMarkerProps,
  MarkerSidebarProps,
  UpdateMapMarkerProps,
  UpdateMarkerInputs,
} from "../../../../types/MapTypes";
import { useUpdateMapMarker } from "../../../../utils/customHooks";

export default function MapMarker({
  markerData,
  mcm,
  setUpdateMarkerDialog,
  setMarkerSidebar,
  public_view,
}: {
  markerData: MapMarkerProps;
  mcm: any;
  public_view: boolean;
  setMarkerSidebar: Dispatch<SetStateAction<MarkerSidebarProps>>;
  setUpdateMarkerDialog: Dispatch<SetStateAction<UpdateMarkerInputs>>;
}) {
  const {
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
    public: markerPublic,
  } = markerData;
  const { project_id } = useParams();
  const navigate = useNavigate();
  const updateMarkerMutation = useUpdateMapMarker();
  const [position, setPosition] = useState<LatLngExpression>([lat, lng]);
  const eventHandlers = {
    click: (e: any) => {
      if (
        !e.originalEvent.shiftKey &&
        !e.originalEvent.altKey &&
        !public_view
      ) {
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
      if (!public_view) {
        mcm.current.show(e.originalEvent);
        setUpdateMarkerDialog({
          id,
          icon,
          text,
          color,
          backgroundColor,
          doc_id,
          map_link,
          public: markerPublic,
          show: false,
        });
      }
    },
    dragend(e: any) {
      if (!public_view) {
        setPosition(e.target._latlng);
        updateMarkerMutation.mutate({
          id,
          map_id,
          lat: e.target._latlng.lat,
          lng: e.target._latlng.lng,
          project_id: project_id as string,
          public: markerPublic,
        });
      }
    },
  };
  return (
    <Marker
      draggable={!public_view}
      eventHandlers={eventHandlers}
      position={position}
      icon={L.divIcon({
        iconSize: [48, 48],
        iconAnchor: [30, 46],
        tooltipAnchor: [-5, -20],
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
                  if (!public_view) {
                    setUpdateMarkerDialog({
                      id,
                      icon,
                      text,
                      color,
                      backgroundColor,
                      doc_id,
                      public: markerPublic,
                      show: true,
                    });
                  }
                }}
              ></div>
            </div>
          </div>
        ),
      })}
    >
      {text && (
        <Tooltip
          direction="top"
          className="p-2 bg-gray-800 border-rounded-sm border-gray-800 border-solid text-white text-lg"
        >
          <div className="Lato text-center">{text}</div>
        </Tooltip>
      )}
    </Marker>
  );
}
