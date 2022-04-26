import L from "leaflet";
import ReactDOM from "react-dom/server";
import { Marker, Popup } from "react-leaflet";
type Props = {
  icon: string;
  color: string;
};
export default function DraggableMarker({ icon, color }: Props) {
  return (
    <Marker
      eventHandlers={{
        contextmenu: (e: any) => {
          alert("BZZZZ");
        },
      }}
      position={[51.505, -0.09]}
      icon={L.divIcon({
        className: "bg-transparent rounded-full relative",
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
                background: `url('https://api.iconify.design/mdi/${icon}.svg?color=${color}') no-repeat`,
                backgroundSize: "2rem",
                color: "white",
              }}
              className="w-full h-full absolute"
            ></div>
          </div>
        ),
      })}
    >
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>
  );
}
