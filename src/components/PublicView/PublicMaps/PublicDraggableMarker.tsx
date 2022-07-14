import L from "leaflet";
import ReactDOM from "react-dom/server";
import { Marker, Popup, Tooltip } from "react-leaflet";
import { Link, useNavigate } from "react-router-dom";
import { MapMarkerProps } from "../../../types/MapTypes";

export default function PublicDraggableMarker({
  icon,
  color,
  backgroundColor,
  text,
  lat,
  lng,
  map_link,
}: MapMarkerProps & {
  mcm: any;
}) {
  const navigate = useNavigate();
  const eventHandlers = {
    click: (e: any) => {
      if (e.originalEvent.shiftKey && map_link) {
        navigate(`../${map_link}`);
      }
    },
  };
  return (
    <Marker
      draggable={false}
      eventHandlers={eventHandlers}
      position={[lat, lng]}
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
                  background: `url('https://api.iconify.design/mdi/${icon.replace(
                    /.*:/g,
                    ""
                  )}.svg?color=%23${color.replace("#", "")}') no-repeat`,
                  backgroundSize: "2rem",
                  backgroundPosition: "center",
                  backgroundColor,
                }}
                className="w-full h-full border-circle fixed p-4"
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
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
