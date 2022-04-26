import L from "leaflet";
import ReactDOM from "react-dom/server";
import { Marker, Popup, useMapEvents } from "react-leaflet";
type Props = {};

export default function DraggableMarker({}: Props) {
  const map = useMapEvents({
    contextmenu() {
      alert("AYYY");
    },
  });

  return (
    <Marker
      position={[51.505, -0.09]}
      icon={L.divIcon({
        className: "bg-transparent rounded-full relative",
        html: ReactDOM.renderToString(
          <div className="text-xl w-2rem h-2rem absolute">
            <div
              style={{
                zIndex: 999999,
                background:
                  "url('https://api.iconify.design/mdi/wizard-hat.svg?color=white') no-repeat",
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
